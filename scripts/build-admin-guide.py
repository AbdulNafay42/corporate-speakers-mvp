"""Generate the illustrated admin handbook. Run: python scripts/build-admin-guide.py
Dependencies: python -m pip install -r docs/admin/requirements.txt
"""
import json, html
from pathlib import Path
from PIL import Image
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/admin'
DATA=json.loads((OUT/'guide-content.json').read_text(encoding='utf-8'))
INK='#19312e';MUTED='#62736c';ACCENT='#a75735';LINE='#d9e1db'
INTRO='This handbook documents the actual local Strapi admin used by the Forum MVP. Screenshots were captured from the running application in dark mode. The Dashboard, Inquiry, and Program screens shared in the request are covered by refreshed captures, together with other available main screens and key forms.'
USAGE=['Chapters 1-5 cover daily editing. Chapter 6 explains the models. Chapters 7-8 cover administrator settings and optional built-in tools.','Each screen includes its navigation path, purpose, actions, and an operational note. Field rules and checklists are in the appendices.','Use the clickable contents, Word navigation pane, or PDF bookmarks. Zoom in or open the source image in docs/admin/screenshots/ to inspect a small control.']
CAPTURE='The temporary Documentation Preview account and sample inquiry are removed after capture. Existing admin credentials, permissions, and website content were not changed. Personal account email addresses are redacted; token values are not shown. Counts and timestamps are illustrative. External marketplace pages and paid-feature onboarding are outside this guide.'
NAV=[['Area','Purpose'],['Home','Recent edits, published entries, profile, and project statistics.'],['Content Manager','Create and maintain Speaker, Program, and Inquiry records.'],['Media Library','Images, folders, and asset metadata.'],['Content-Type Builder','Schema reference; developer-managed model changes.'],['Settings','Staff accounts, roles, tokens, and plugin configuration.'],['Profile avatar','Personal account and interface preferences.']]
pages=[{'kind':'cover'},{'kind':'intro'},{'kind':'contents'}];figure=0
for ci,ch in enumerate(DATA['chapters'],1):
 ch['page']=len(pages)+1
 for si,s in enumerate(ch['screens'],1):
  figure+=1;s.update(number=f'{ci}.{si}',figure=figure,chapter=ch['title'],chapterIndex=ci,first=si==1,page=len(pages)+1)
  assert (OUT/'screenshots'/f"{s['id']}.png").exists(),s['id']
  pages.append({'kind':'screen','screen':s})
for ai,a in enumerate(DATA['appendices'],1):pages.append({'kind':'appendix','index':ai,**a})
TOTAL=len(pages)

def esc(s):return html.escape(str(s))
# WORD
word=Document();sec=word.sections[0]
sec.page_width=Inches(8.2677);sec.page_height=Inches(11.6929)
sec.top_margin=sec.bottom_margin=Inches(.58);sec.left_margin=sec.right_margin=Inches(.62)
sec.header_distance=sec.footer_distance=Inches(.25)
st=word.styles['Normal'];st.font.name='Arial';st.font.size=Pt(10);st.font.color.rgb=RGBColor.from_string(INK[1:]);st.paragraph_format.space_after=Pt(6);st.paragraph_format.line_spacing=1.05
for name,size in [('Title',38),('Heading 1',22),('Heading 2',18),('Heading 3',12)]:
 st=word.styles[name];st.font.name='Arial';st.font.size=Pt(size);st.font.color.rgb=RGBColor.from_string(INK[1:]);st.paragraph_format.space_before=Pt(7);st.paragraph_format.space_after=Pt(8)
word.core_properties.title=DATA['title'];word.core_properties.author='Forum Project';word.core_properties.subject='Illustrated Strapi admin operations manual'
h=sec.header.paragraphs[0];h.text='FORUM / ADMIN HANDBOOK';h.runs[0].font.size=Pt(8);h.runs[0].font.color.rgb=RGBColor.from_string(MUTED[1:])
f=sec.footer.paragraphs[0];f.text='Version 1.0 | 10 November 2026                                          Page '
fld=OxmlElement('w:fldSimple');fld.set(qn('w:instr'),'PAGE');f._p.append(fld)
for r in f.runs:r.font.size=Pt(8)
bookmark_id=0
def bookmark(p,name):
 global bookmark_id
 bookmark_id+=1;a=OxmlElement('w:bookmarkStart');a.set(qn('w:id'),str(bookmark_id));a.set(qn('w:name'),name);b=OxmlElement('w:bookmarkEnd');b.set(qn('w:id'),str(bookmark_id));p._p.insert(0,a);p._p.append(b)
def doclink(label,anchor):
 p=word.add_paragraph();link=OxmlElement('w:hyperlink');link.set(qn('w:anchor'),anchor);r=OxmlElement('w:r');t=OxmlElement('w:t');t.text=label;r.append(t);link.append(r);p._p.append(link)
def doctable(rows):
 t=word.add_table(rows=1,cols=len(rows[0]));t.style='Table Grid'
 for j,v in enumerate(rows[0]):
  cell=t.rows[0].cells[j];cell.text=v
  shade=OxmlElement('w:shd');shade.set(qn('w:fill'),'E5EBE4');cell._tc.get_or_add_tcPr().append(shade)
  for r in cell.paragraphs[0].runs:r.bold=True
 for row in rows[1:]:
  cells=t.add_row().cells
  for j,v in enumerate(row):cells[j].text=v
 for row in t.rows:
  for cell in row.cells:
   for p in cell.paragraphs:
    p.paragraph_format.space_after=Pt(4)
    for r in p.runs:r.font.size=Pt(9)
  row._tr.get_or_add_trPr().append(OxmlElement('w:cantSplit'))
 repeat=OxmlElement('w:tblHeader');t.rows[0]._tr.get_or_add_trPr().append(repeat)
for pi,page in enumerate(pages):
 if pi:word.add_page_break()
 kind=page['kind']
 if kind=='cover':
  word.add_paragraph('FORUM / OPERATIONS SERIES',style='Subtitle');word.add_paragraph('\n\n');word.add_heading('Admin\nHandbook',0);word.add_paragraph('Corporate Speakers & Programs',style='Subtitle');word.add_paragraph('A practical, illustrated guide to the built-in Strapi admin.');word.add_paragraph('\n47 documented screens | 8 chapters\nField references, checklists, and troubleshooting.');word.add_paragraph('Strapi 5.61.1 | Version 1.0\n10 November 2026');word.add_paragraph('\nFor content editors, operations staff, and application administrators.');word.add_paragraph('Admin: http://localhost:1337/admin\nWebsite: http://localhost:3000')
 elif kind=='intro':
  word.add_heading('Before you begin',1);word.add_paragraph(INTRO);word.add_heading('How to use this guide',2)
  for t in USAGE:word.add_paragraph(t,style='List Bullet')
  word.add_heading('Navigation at a glance',2);doctable(NAV);word.add_heading('Capture notes',2);word.add_paragraph(CAPTURE)
 elif kind=='contents':
  word.add_heading('Contents',1)
  for ci,ch in enumerate(DATA['chapters'],1):doclink(ch['title'],f'chapter_{ci}');word.add_paragraph(ch['description'],style='Caption')
  word.add_heading('Quick-reference appendices',2)
  for ai,a in enumerate(DATA['appendices'],1):doclink(a['title'],f'appendix_{ai}')
 elif kind=='screen':
  s=page['screen'];p=word.add_paragraph(s['chapter'].upper());p.runs[0].font.size=Pt(8)
  if s['first']:
   p.style=word.styles['Heading 1'];p.runs[0].font.size=Pt(8)
   bookmark(p,f"chapter_{s['chapterIndex']}")
  word.add_heading(s['number']+'  '+s['title'],2);word.add_paragraph('Navigation: '+s['path'],style='Caption');word.add_paragraph(s['purpose'])
  pic=OUT/'screenshots'/f"{s['id']}.png";iw,ih=Image.open(pic).size;scale=min(7.0/iw,4.35/ih);p=word.add_paragraph();p.alignment=1;p.paragraph_format.space_after=Pt(2);p.add_run().add_picture(str(pic),width=Inches(iw*scale))
  word.add_paragraph(f"Figure {s['figure']:02d}. {s['title']} - Strapi 5.61.1.",style='Caption');word.add_heading('What to do',3)
  for n,t in enumerate(s['steps'],1):word.add_paragraph(f'{n}. {t}')
  p=word.add_paragraph();p.add_run('Note: ').bold=True;p.add_run(s['note'])
 else:
  h=word.add_heading(page['title'],1);bookmark(h,f"appendix_{page['index']}")
  if 'table'in page:doctable(page['table'])
  if 'note'in page:word.add_paragraph(page['note'])
  for title,items in page.get('blocks',[]):
   word.add_heading(title,3)
   for t in items:word.add_paragraph(t,style='List Bullet')
settings=word.settings.element
update=OxmlElement('w:updateFields');update.set(qn('w:val'),'true');settings.append(update)
word.save(OUT/'Forum-Admin-Handbook.docx')
# PDF
fonts=Path('C:/Windows/Fonts')
if (fonts/'arial.ttf').exists():
 pdfmetrics.registerFont(TTFont('Guide',str(fonts/'arial.ttf')));pdfmetrics.registerFont(TTFont('GuideBold',str(fonts/'arialbd.ttf')))
FONT='Guide'if'Guide'in pdfmetrics.getRegisteredFontNames()else'Helvetica';BOLD='GuideBold'if FONT=='Guide'else'Helvetica-Bold'
W,H=A4;M=42;BW=W-2*M;y=H-58;overflow=[]
pdf=canvas.Canvas(str(OUT/'Forum-Admin-Handbook.pdf'),pagesize=A4);pdf.setTitle(DATA['title']);pdf.setAuthor('Forum Project');pdf.setSubject('Illustrated Strapi administrator handbook')
def para(text,size=10.5,color=INK,space=7,bold=False,indent=0):
 global y
 p=Paragraph(text,ParagraphStyle('p',fontName=BOLD if bold else FONT,fontSize=size,leading=size*1.25,textColor=colors.HexColor(color)));_,height=p.wrap(BW-indent,1500);y-=height;p.drawOn(pdf,M+indent,y);y-=space
 if y<44:overflow.append((pdf.getPageNumber(),text[:65],round(y,1)))
def head(text,size=21):para(esc(text),size,space=10,bold=True)
def bullet(text,n=None):para(esc((str(n)+'. 'if n else '- ')+text),10,space=6,indent=5)
def pdftable(rows):
 global y
 widths=[85,140,BW-225]if len(rows[0])==3 else[130,BW-130]
 style=ParagraphStyle('cell',fontName=FONT,fontSize=9,leading=11.7,textColor=colors.HexColor(INK));cells=[[Paragraph(esc(v),style)for v in row]for row in rows]
 t=Table(cells,colWidths=widths);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e5ebe4')),('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),.3,colors.HexColor(LINE)),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]));_,ht=t.wrap(BW,1500);y-=ht;t.drawOn(pdf,M,y);y-=12
 if y<44:overflow.append((pdf.getPageNumber(),'table',round(y,1)))
for pi,page in enumerate(pages,1):
 y=H-58;pdf.bookmarkPage(f'page_{pi}');pdf.setFillColor(colors.HexColor(MUTED));pdf.setFont(FONT,8);pdf.drawString(M,H-27,'FORUM / ADMIN HANDBOOK');pdf.drawRightString(W-M,H-27,'OPERATIONS GUIDE');pdf.setStrokeColor(colors.HexColor(LINE));pdf.line(M,H-36,W-M,H-36)
 kind=page['kind']
 if kind=='cover':
  y=H-125;para('CORPORATE SPEAKERS &amp; PROGRAMS',11,ACCENT,space=30,bold=True);head('Admin',48);head('Handbook',48);para('A practical, illustrated guide to the built-in Strapi admin.',16,MUTED,space=30);para('47 documented screens<br/>8 organized chapters<br/>Field references, checklists, and troubleshooting',14,space=40);pdf.setFillColor(colors.HexColor(INK));pdf.rect(M,170,BW,120,fill=1,stroke=0);pdf.setFillColor(colors.white);pdf.setFont(BOLD,15);pdf.drawString(M+20,255,'Forum MVP');pdf.setFont(FONT,11);pdf.drawString(M+20,228,'Strapi 5.61.1 | Version 1.0');pdf.drawString(M+20,205,'10 November 2026');y=140;para('For content editors, operations staff, and application administrators.',10,MUTED)
 elif kind=='intro':
  head('Before you begin');para(esc(INTRO));head('How to use this guide',14)
  for t in USAGE:bullet(t)
  head('Navigation at a glance',14);pdftable(NAV);head('Capture notes',14);para(esc(CAPTURE),9.5,MUTED)
 elif kind=='contents':
  head('Contents');pdf.addOutlineEntry('Contents',f'page_{pi}',0)
  for ci,ch in enumerate(DATA['chapters'],1):
   top=y;para(esc(ch['title']),12,bold=True,space=3);pdf.linkRect('',f'chapter_{ci}',(M,y,W-M,top+3),relative=0,thickness=0);pdf.setFont(FONT,10);pdf.drawRightString(W-M,top-12,str(ch['page']));para(esc(ch['description']),9,MUTED,space=14)
  head('Quick-reference appendices',14)
  for ai,a in enumerate(DATA['appendices'],1):
   top=y;para(esc(a['title']),10.5,space=9);pdf.linkRect('',f'appendix_{ai}',(M,y,W-M,top+2),relative=0,thickness=0);pdf.setFont(FONT,9);pdf.drawRightString(W-M,top-11,str(50+ai))
 elif kind=='screen':
  s=page['screen'];para(esc(s['chapter'].upper()),8,MUTED,space=8,bold=True)
  if s['first']:pdf.bookmarkPage(f"chapter_{s['chapterIndex']}");pdf.addOutlineEntry(s['chapter'],f"chapter_{s['chapterIndex']}",0)
  pdf.bookmarkPage(s['id']);pdf.addOutlineEntry(s['number']+' '+s['title'],s['id'],1);head(s['number']+'  '+s['title'],20);para('<b>Navigation:</b> '+esc(s['path']),9,MUTED,space=9);para(esc(s['purpose']),10.5,space=10)
  pic=OUT/'screenshots'/f"{s['id']}.png";iw,ih=Image.open(pic).size;scale=min(BW/iw,306/ih);sw,sh=iw*scale,ih*scale;pdf.drawImage(str(pic),M+(BW-sw)/2,y-sh,width=sw,height=sh,mask='auto');y-=sh+7;para(f"Figure {s['figure']:02d}. "+esc(s['title'])+' - Strapi 5.61.1.',8,MUTED,space=11);head('What to do',12)
  for n,t in enumerate(s['steps'],1):bullet(t,n)
  y-=4;para('<b>Note:</b> '+esc(s['note']),9.5,MUTED,space=4)
 else:
  pdf.bookmarkPage(f"appendix_{page['index']}");pdf.addOutlineEntry(page['title'],f"appendix_{page['index']}",0);head(page['title'])
  if 'table'in page:pdftable(page['table'])
  if 'note'in page:para(esc(page['note']),10,MUTED)
  for title,items in page.get('blocks',[]):
   head(title,12)
   for t in items:bullet(t)
 pdf.setStrokeColor(colors.HexColor(LINE));pdf.line(M,38,W-M,38);pdf.setFillColor(colors.HexColor(MUTED));pdf.setFont(FONT,8);pdf.drawString(M,25,'Version 1.0 | 10 November 2026');pdf.drawRightString(W-M,25,f'{pi:02d} / {TOTAL:02d}');pdf.showPage()
pdf.save()
if overflow:raise RuntimeError('PDF page overflow: '+repr(overflow))
# HTML AND MARKDOWN
blocks=['<header><p>FORUM / OPERATIONS SERIES</p><h1>Admin Handbook</h1><h2>Corporate Speakers &amp; Programs</h2><p>Strapi 5.61.1 | Version 1.0 | 10 November 2026</p><p>47 documented screens across 8 chapters.</p></header>','<section><h2>Before you begin</h2><p>'+esc(INTRO)+'</p><p>'+esc(CAPTURE)+'</p></section>','<nav id="contents"><h2>Contents</h2>'];md=['# Forum Admin Handbook','','Corporate Speakers & Programs | Strapi 5.61.1 | Version 1.0 | 10 November 2026','','[Word](Forum-Admin-Handbook.docx) | [PDF](Forum-Admin-Handbook.pdf) | [HTML guide](Forum-Admin-Handbook.html)','',INTRO,'',CAPTURE,'','## Contents','']
for ci,ch in enumerate(DATA['chapters'],1):blocks.append(f'<a href="#chapter-{ci}">{esc(ch["title"])}</a>');md.append(f'- [{ch["title"]}](#chapter-{ci})')
for ai,a in enumerate(DATA['appendices'],1):blocks.append(f'<a href="#appendix-{ai}">{esc(a["title"])}</a>')
blocks.append('</nav>')
for ci,ch in enumerate(DATA['chapters'],1):
 blocks.append(f'<section id="chapter-{ci}"><h2>{esc(ch["title"])}</h2><p>{esc(ch["description"])}</p>');md.extend(['',f'<a id="chapter-{ci}"></a>',f'## {ch["title"]}','',ch['description']])
 for s in ch['screens']:
  src=f'screenshots/{s["id"]}.png';blocks.append(f'<article id="{s["id"]}"><p class="kicker">SCREEN {s["number"]}</p><h3>{esc(s["title"])}</h3><p class="path">Navigation: {esc(s["path"])}</p><p>{esc(s["purpose"])}</p><figure><a href="{src}" target="_blank"><img src="{src}" alt="{esc(s["title"])}" loading="lazy"></a><figcaption>Figure {s["figure"]:02d}. {esc(s["title"])}. Click to open at full resolution.</figcaption></figure><h4>What to do</h4><ol>'+''.join('<li>'+esc(t)+'</li>'for t in s['steps'])+'</ol><aside><strong>Note:</strong> '+esc(s['note'])+'</aside><a class="back" href="#contents">Back to contents</a></article>');md.extend(['',f'### {s["number"]} {s["title"]}','',f'**Navigation:** {s["path"]}','',s['purpose'],'',f'![{s["title"]}]({src})','']+[f'{n}. {t}'for n,t in enumerate(s['steps'],1)]+['',f'**Note:** {s["note"]}'])
 blocks.append('</section>')
for ai,a in enumerate(DATA['appendices'],1):
 blocks.append(f'<section id="appendix-{ai}"><h2>{esc(a["title"])}</h2>');md.extend(['','## '+a['title'],''])
 if 'table'in a:
  rows=a['table'];blocks.append('<table>'+''.join('<tr>'+''.join('<td>'+esc(v)+'</td>'for v in row)+'</tr>'for row in rows)+'</table>');md.extend(['| '+' | '.join(rows[0])+' |','| '+' | '.join(['---']*len(rows[0]))+' |']+['| '+' | '.join(r)+' |'for r in rows[1:]])
 if 'note'in a:blocks.append('<p>'+esc(a['note'])+'</p>');md.extend(['',a['note']])
 for title,items in a.get('blocks',[]):blocks.append('<h3>'+esc(title)+'</h3><ul>'+''.join('<li>'+esc(t)+'</li>'for t in items)+'</ul>');md.extend(['','### '+title,'']+['- '+t for t in items])
 blocks.append('</section>')
css='*{box-sizing:border-box}html{scroll-behavior:smooth}body{font:16px/1.65 Arial,sans-serif;background:#f5f6ef;color:#19312e;margin:0}header,nav,section{max-width:1100px;margin:32px auto;padding:35px 45px;background:white;border:1px solid #d9e1db}header{background:#19312e;color:#f5f6ef;padding-block:65px}h1{font-size:64px;line-height:1.1;letter-spacing:-3px}h2{font-size:29px}h3{font-size:24px}.kicker{font-size:11px;letter-spacing:2px}.path,figcaption{color:#62736c;font-size:13px}nav a{display:block;padding:8px;color:#19312e}article{border-top:1px solid #d9e1db;margin-top:30px;padding-top:25px}figure{margin:25px 0}img{display:block;width:100%;height:auto}li{margin:8px 0}aside{background:#f0f3ec;border-left:3px solid #a75735;padding:14px 20px}.back{display:inline-block;margin-top:20px;color:#62736c;font-size:12px}table{width:100%;border-collapse:collapse}td{padding:13px;border:1px solid #d9e1db;vertical-align:top}tr:first-child{background:#e5ebe4;font-weight:bold}@media(max-width:650px){header,nav,section{margin:15px;padding:22px}h1{font-size:44px}h2{font-size:25px}h3{font-size:21px}table{font-size:12px}td{padding:8px}}@media print{article{break-before:page}.back{display:none}img{max-height:45vh;object-fit:contain}}'
(OUT/'Forum-Admin-Handbook.html').write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Forum Admin Handbook</title><style>'+css+'</style></head><body>'+''.join(blocks)+'</body></html>',encoding='utf-8');(OUT/'README.md').write_text('\n'.join(md)+'\n',encoding='utf-8')
(OUT/'requirements.txt').write_text('python-docx==1.2.0\nreportlab>=4.0,<5\nPillow>=11,<13\n')
print(f'Generated Word, PDF ({TOTAL} pages), HTML, and Markdown with {figure} screenshots.')
