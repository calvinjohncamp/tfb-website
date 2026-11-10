"""Rebuild four branded member PDFs from audited original text, without policy edits.
Requires reportlab, pypdf, pdfplumber, fonttools, svglib and Poppler.
Original PDFs and source URLs are retained under docs/quellen/mitgliederinfos.
"""
from pathlib import Path
import json,re,html,subprocess,tempfile,hashlib,argparse
from fontTools.ttLib import TTFont as FontFile
from fontTools.varLib.instancer import instantiateVariableFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, Color, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfgen.canvas import Canvas
from reportlab.graphics import renderPDF
from svglib.svglib import svg2rlg
from pypdf import PdfReader
import pdfplumber
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/docs'
QA=ROOT/'output/member-info-qa'
DATA=json.loads((ROOT/'tools/member-info-content.json').read_text())
NAVY=HexColor('#001D3D');YELLOW=HexColor('#FFC300');INK=HexColor('#202932');MUTED=HexColor('#63717D');LINE=HexColor('#DCE2E7');SOFT=HexColor('#F7F8F8')
W,H=A4;MARGIN=48;WIDTH=W-2*MARGIN


def normalized(text):
    return re.sub(r'\s+',' ',text.replace('\u00ad','').replace('\u00a0',' ')).strip()


def source_body(doc):
    text=doc.get('approvedRevision',{}).get('text',doc['canonicalSourceText'])
    assert text.startswith(doc['title'])
    text=text[len(doc['title']):]
    text=re.sub(r'(?m)^\s*\d+\.\s*','',text)
    text=re.sub(r'[•\uf0b7\uf0a7]','',text)
    return normalized(text)


def body_text(blocks):
    return normalized(' '.join(' '.join(' '.join(row) for row in b['rows']) if b['type']=='table' else b.get('text','') for b in blocks))


class Pages(Canvas):
    def __init__(self,*args,label='',**kwargs):
        super().__init__(*args,**kwargs);self.states=[];self.label=label
    def showPage(self):
        self.states.append(dict(self.__dict__));self._startPage()
    def save(self):
        total=len(self.states)
        for state in self.states:
            self.__dict__.update(state)
            self.setStrokeColor(LINE);self.setLineWidth(.6);self.line(MARGIN,49,W-MARGIN,49)
            self.setFillColor(MUTED);self.setFont('Body',8)
            self.drawString(MARGIN,33,'Tennisfreunde Bielstein e.V.')
            self.drawCentredString(W/2,33,self.label)
            self.setFillColor(NAVY);self.setFont('Bold',8)
            self.drawRightString(W-MARGIN,33,f'{self._pageNumber:02d} / {total:02d}')
            Canvas.showPage(self)
        Canvas.save(self)


def fonts(folder):
    for name,src,weight in [('Body','dm-sans',420),('Bold','dm-sans',700),('Display','bricolage-grotesque',700)]:
        f=FontFile(ROOT/f'assets/fonts/editorial/{src}.ttf')
        axes={a.axisTag:weight if a.axisTag=='wght' else a.defaultValue for a in f['fvar'].axes}
        instance=instantiateVariableFont(f,axes,inplace=False)
        family='TFB Bricolage Grotesque' if name=='Display' else 'TFB DM Sans'
        style='Regular' if name=='Body' else 'Bold'
        for name_id,value in [(1,family),(2,style),(4,family+' '+style),(6,'TFB-'+name)]:
            for record in instance['name'].names:
                if record.nameID==name_id:record.string=value.encode(record.getEncoding())
        path=folder/(name+'.ttf');instance.save(path)
        pdfmetrics.registerFont(TTFont(name,str(path)))
    pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold',italic='Body',boldItalic='Bold')


def build(slug,doc):
    assert source_body(doc)==body_text(doc['blocks']),f'Unmatched source text: {slug}'
    assert hashlib.sha256((ROOT/'docs/quellen/mitgliederinfos'/f'{slug}.pdf').read_bytes()).hexdigest()==doc['sourceSha256']
    path=OUT/f'tfb-{slug}.pdf'
    styles={
      'title':ParagraphStyle('Title',fontName='Display',fontSize=31,leading=35,textColor=NAVY,spaceAfter=24),
      'h':ParagraphStyle('Heading',fontName='Display',fontSize=15,leading=19,textColor=NAVY,spaceBefore=18,spaceAfter=9,keepWithNext=True),
      'p':ParagraphStyle('Body',fontName='Body',fontSize=10.5,leading=15.5,textColor=INK,spaceAfter=10,allowWidows=0),
      'bullet':ParagraphStyle('Bullet',fontName='Body',fontSize=10.5,leading=15.5,textColor=INK,leftIndent=16,firstLineIndent=-11,spaceAfter=6),
      'contact':ParagraphStyle('Contact',fontName='Body',fontSize=11,leading=17,textColor=INK,spaceAfter=18),
    }
    if slug=='platzordnung':styles['p'].fontSize=13.5;styles['p'].leading=20
    if slug=='jugendkonzept':
        styles['p'].spaceAfter=8
        styles['h'].spaceBefore=16
        styles['bullet'].spaceAfter=5
    if slug=='regeln-spielbetrieb':
        styles['p'].fontSize=10.4;styles['p'].leading=14.8;styles['p'].spaceAfter=8
        styles['bullet'].fontSize=10.4;styles['bullet'].leading=14.8;styles['bullet'].spaceAfter=4;styles['bullet'].leftIndent=47
    def para(text,kind='p'):
        value=html.escape(text).replace('\n','<br/>')
        if kind=='contact':
            value=re.sub(r'^(Verfasser:|Adresse:|Postanschrift:|Homepage:|E-Mail:)',r'<b>\1</b>',value)
        return Paragraph(value,styles[kind])
    logo=svg2rlg(str(ROOT/'assets/brand/tfb-logo-midnight-amber.svg'))
    def header(canvas,layout):
        canvas.saveState()
        target=134;scale=target/logo.width
        canvas.saveState();canvas.translate(MARGIN,H-38-logo.height*scale);canvas.scale(scale,scale);renderPDF.draw(logo,canvas,0,0);canvas.restoreState()
        canvas.setFillColor(MUTED);canvas.setFont('Bold',8)
        canvas.drawRightString(W-MARGIN,H-50,'MITGLIEDERINFOS')
        canvas.setFillColor(NAVY);canvas.setFont('Body',9);canvas.drawRightString(W-MARGIN,H-68,doc['label'])
        canvas.setFillColor(YELLOW);canvas.roundRect(W-MARGIN-38,H-83,38,3,1.5,fill=1,stroke=0)
        canvas.setStrokeColor(LINE);canvas.setLineWidth(.6);canvas.line(MARGIN,H-112,W-MARGIN,H-112)
        canvas.restoreState()
    story=[para(doc['title'],'title')]
    for i,b in enumerate(doc['blocks']):
        kind=b['type']
        if kind=='pagebreak':story.append(PageBreak());continue
        if kind=='table':
            has_header=b.get('header',True)
            rows=[[Paragraph(html.escape(cell),ParagraphStyle('Cell',fontName='Bold' if row==0 and has_header else 'Body',fontSize=9.2,leading=13,textColor=white if row==0 and has_header else INK)) for cell in cells] for row,cells in enumerate(b['rows'])]
            t=Table(rows,colWidths=[WIDTH/5]*5 if has_header else [WIDTH*.68,WIDTH*.32],hAlign='LEFT');t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),NAVY if has_header else SOFT),('BACKGROUND',(0,1),(-1,-1),SOFT),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),10 if has_header else 7),('BOTTOMPADDING',(0,0),(-1,-1),10 if has_header else 7),('LEFTPADDING',(0,0),(-1,-1),8)]));story.extend([t,Spacer(1,14)]);continue
        if kind=='item':
            if slug=='hausordnung' and b['number']==7:story.append(PageBreak())
            number=Paragraph(f'{b["number"]:02d}',ParagraphStyle('Number',fontName='Display',fontSize=15 if slug=='platzordnung' else 11,leading=20 if slug=='platzordnung' else 15,textColor=NAVY))
            t=Table([[number,para(b['text'])]],colWidths=[34,WIDTH-34],hAlign='LEFT')
            padding=10 if slug=='platzordnung' else 4
            t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(0,0),0),('LEFTPADDING',(1,0),(1,0),0),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),padding),('BOTTOMPADDING',(0,0),(-1,-1),padding)]))
            if slug=='platzordnung':t.setStyle(TableStyle([('LINEBELOW',(0,0),(-1,0),.6,LINE)]))
            story.append(t);continue
        if kind=='h':story.append(para(b['text'],'h'));continue
        if kind=='bullet':story.append(Paragraph(html.escape(b['text']),styles['bullet'],bulletText='•'));continue
        if slug=='platzordnung' and b['text'].lower()=='danke, euer vorstand':story.append(Spacer(1,14))
        paragraph=para(b['text'],kind)
        if b['text'] in ['Herzliche Grüße','Sportliche Grüße']:paragraph.keepWithNext=True
        story.append(paragraph)
    pdf=SimpleDocTemplate(str(path),pagesize=A4,rightMargin=MARGIN,leftMargin=MARGIN,topMargin=132,bottomMargin=67,title=doc['title'],author='Tennisfreunde Bielstein e.V.',subject='Mitgliederinfos',pageCompression=1,allowSplitting=1)
    pdf.build(story,onFirstPage=header,onLaterPages=header,canvasmaker=lambda *a,**kw:Pages(*a,label=doc['label'],**kw))
    # Audit every original paragraph in order against the actual typeset output.
    with pdfplumber.open(path) as checked:
        body=' '.join(p.crop((MARGIN-2,124,W-MARGIN+2,H-62)).extract_text(x_tolerance=2,y_tolerance=3) or '' for p in checked.pages)
        actual=normalized(body)
        pos=0
        for b in doc['blocks']:
            if b['type']=='pagebreak':continue
            value=normalized(' '.join(' '.join(row) for row in b['rows']) if b['type']=='table' else b['text'])
            found=actual.find(value,pos)
            assert found>=0,f'Missing output paragraph {slug}: {value[:110]}'
            pos=found+len(value)
        for index,p in enumerate(checked.pages):
            assert abs(p.width-W)<.1 and abs(p.height-H)<.1
            chars=p.crop((MARGIN-2,124,W-MARGIN+2,H-62)).chars
            assert all(c['x0']>=MARGIN-2 and c['x1']<=W-MARGIN+2 for c in chars),f'Overflow {slug}/{index+1}'
    print(slug,len(PdfReader(path).pages),'pages',path.stat().st_size,'bytes; complete source and output text verified')
    return {'file':str(path.relative_to(ROOT)),'pages':len(PdfReader(path).pages),'sourceSha256':doc['sourceSha256'],'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'contentAndOutputTextVerified':True,'contentBasis':'approvedRevision' if doc.get('approvedRevision') else 'originalSource'}


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('documents',nargs='*');args=parser.parse_args()
    if any(slug not in DATA for slug in args.documents):parser.error('Unknown document')
    selected=args.documents or list(DATA)
    OUT.mkdir(exist_ok=True,parents=True);QA.mkdir(exist_ok=True,parents=True)
    with tempfile.TemporaryDirectory(prefix='tfb-member-fonts-') as tmp:
        fonts(Path(tmp));result={slug:build(slug,DATA[slug]) for slug in selected}
    (QA/'text-audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
