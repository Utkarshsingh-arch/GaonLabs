// Script to generate a genuine, standards-compliant multi-page PDF document for GaonLab Smart Reader demonstration
import fs from 'fs';
import path from 'path';

function createPdf() {
  const page1Content = `
q
% Clean header banner
0.11 0.45 0.35 rg
40 760 515 45 re f
1 1 1 rg
BT
/F1 18 Tf
55 778 Td
(GaonLab Visual Learning Guide: Class 8 Science) Tj
ET

0.2 0.25 0.3 rg
BT
/F1 15 Tf
40 725 Td
(Chapter: Forces, Motion and Surface Interactions) Tj
/F2 10 Tf
0 -17 Td
(Document ID: doc-forces-and-friction-cl8 | GaonLab Curriculum Laboratory) Tj
0 -13 Td
(License: Creative Commons Attribution-NonCommercial 4.0 International) Tj
ET

% Section 1
0.15 0.3 0.25 rg
BT
/F1 13 Tf
40 655 Td
(1. What is a Force?) Tj
ET

0.1 0.1 0.1 rg
BT
/F2 11 Tf
40 635 Td
(A force is an interaction that, when unopposed, changes the motion of an object.) Tj
0 -16 Td
(Forces can cause stationary objects to move, or moving objects to change speed or direction.) Tj
0 -16 Td
(Forces can be broadly classified into Contact Forces and Non-Contact Forces:) Tj
0 -18 Td
(  - Contact Forces: Muscular force, mechanical force, and frictional resistance.) Tj
0 -16 Td
(  - Non-Contact Forces: Gravitational pull, magnetic attraction, and electrostatic force.) Tj
ET

% Callout Box
0.93 0.96 0.94 rg
40 495 515 45 re f
0.11 0.45 0.35 RG
1.5 w
40 495 515 45 re S

0.11 0.45 0.35 rg
BT
/F1 10 Tf
55 522 Td
(KEY OBSERVATION:) Tj
/F2 10 Tf
105 0 Td
(Whenever a body slides or rolls across another surface, a force comes into play) Tj
/F2 10 Tf
-105 -14 Td
(that resists relative motion. This resisting force is called friction.) Tj
ET

% Section 2
0.15 0.3 0.25 rg
BT
/F1 13 Tf
40 450 Td
(2. Why Does a Moving Object Eventually Stop?) Tj
ET

0.1 0.1 0.1 rg
BT
/F2 11 Tf
40 430 Td
(Imagine kicking a football across a village playground. After travelling a certain distance,) Tj
0 -16 Td
(the ball slows down and gradually comes to a complete rest. Why does this happen?) Tj
0 -18 Td
(According to Newton's First Law of Motion, a moving object will continue moving in a straight) Tj
0 -16 Td
(line at constant speed unless acted upon by an external net force.) Tj
0 -18 Td
(The football stops because of an opposing contact force exerted by the rough grass and soil.) Tj
0 -16 Td
(This opposing force acts in the opposite direction to the direction of motion.) Tj
ET

% Section 3
0.15 0.3 0.25 rg
BT
/F1 13 Tf
40 315 Td
(3. Direction of Frictional Force) Tj
ET

0.1 0.1 0.1 rg
BT
/F2 11 Tf
40 295 Td
(The frictional force always opposes the relative motion between two surfaces in contact.) Tj
0 -16 Td
(If you push a heavy wooden crate towards the right, friction acts towards the left.) Tj
0 -16 Td
(If you pull the crate towards the left, friction acts towards the right.) Tj
0 -18 Td
(Therefore, friction always opposes applied motion and works against slipping.) Tj
ET

% Footer Page 1
0.5 0.5 0.5 rg
BT
/F2 9 Tf
40 35 Td
(GaonLab Open Educational Resource -- Authorized Class 8 Companion Guide -- Page 1 of 3) Tj
ET
Q
`;

  const page2Content = `
q
% Header
0.11 0.45 0.35 rg
40 780 515 30 re f
1 1 1 rg
BT
/F1 14 Tf
55 790 Td
(Forces and Friction: Part II -- Microscopic Nature of Surfaces) Tj
ET

% Section 4
0.15 0.3 0.25 rg
BT
/F1 13 Tf
40 740 Td
(4. The Microscopic Cause of Friction: Interlocking Irregularities) Tj
ET

0.1 0.1 0.1 rg
BT
/F2 11 Tf
40 720 Td
(Even surfaces that look and feel perfectly smooth to our bare hands have countless microscopic) Tj
0 -16 Td
(hills, valleys, and irregularities when observed under a high-power microscope.) Tj
0 -18 Td
(When two surfaces are placed against each other, the microscopic irregularities of both) Tj
0 -16 Td
(surfaces interlock with one another, like the teeth of two gears or two wire brushes.) Tj
0 -18 Td
(To move one surface over another, we must apply enough force to overcome this interlocking.) Tj
0 -16 Td
(On rough surfaces, like an unpaved mud road, the irregularities are larger, producing greater friction.) Tj
ET

% Callout diagram simulation box
0.96 0.96 0.98 rg
40 560 515 65 re f
0.3 0.35 0.5 RG
1 w
40 560 515 65 re S

0.2 0.3 0.6 rg
BT
/F1 11 Tf
55 605 Td
(MICROSCOPIC VIEW: Surface Interlocking Model) Tj
/F2 10 Tf
0 -16 Td
(Top Surface: [Ridges and Valleys] ----> Movement Applied) Tj
0 -15 Td
(Bottom Surface: [Interlocking Ridges] <---- Opposing Frictional Resistance) Tj
ET

% Section 5
0.15 0.3 0.25 rg
BT
/F1 13 Tf
40 515 Td
(5. Factors Affecting Friction) Tj
ET

0.1 0.1 0.1 rg
BT
/F2 11 Tf
40 495 Td
(Experiments prove that frictional resistance depends on two primary factors:) Tj
0 -18 Td
(1. The nature of the surfaces in contact: Roughness increases interlocking, while smoothness decreases it.) Tj
0 -16 Td
(2. The normal force pressing the two surfaces together: If you push a box down firmly, friction increases.) Tj
0 -18 Td
(Notice: Friction does NOT depend on the apparent area of contact for rigid surfaces!) Tj
0 -16 Td
(A brick resting on its broad face experiences the same friction as resting on its narrow side.) Tj
ET

% Section 6
0.15 0.3 0.25 rg
BT
/F1 13 Tf
40 370 Td
(6. Why is it Easier to Move Objects on Smooth Surfaces?) Tj
ET

0.1 0.1 0.1 rg
BT
/F2 11 Tf
40 350 Td
(Smooth surfaces have significantly smaller microscopic irregularities. With fewer ridges interlocking,) Tj
0 -16 Td
(the resistance force is remarkably lower. When a lubricant such as machine oil or grease is introduced) Tj
0 -16 Td
(between sliding parts, it forms a thin fluid layer that prevents direct solid-to-solid contact.) Tj
0 -18 Td
(Instead of solid ridges rubbing together, the fluid layers slide over one another smoothly.) Tj
ET

% Footer Page 2
0.5 0.5 0.5 rg
BT
/F2 9 Tf
40 35 Td
(GaonLab Open Educational Resource -- Authorized Class 8 Companion Guide -- Page 2 of 3) Tj
ET
Q
`;

  const page3Content = `
q
% Header
0.11 0.45 0.35 rg
40 780 515 30 re f
1 1 1 rg
BT
/F1 14 Tf
55 790 Td
(Forces and Friction: Part III -- Types of Friction & Village Applications) Tj
ET

% Section 7
0.15 0.3 0.25 rg
BT
/F1 13 Tf
40 740 Td
(7. Static, Sliding and Rolling Friction Compared) Tj
ET

0.1 0.1 0.1 rg
BT
/F2 11 Tf
40 720 Td
(Scientists and engineers classify friction into three progressive regimes:) Tj
0 -18 Td
(1. Static Friction: The opposing force when you attempt to move a stationary body. It is the strongest.) Tj
0 -16 Td
(2. Sliding (Kinetic) Friction: The resisting force once the object begins to slide. Slightly less than static.) Tj
0 -16 Td
(3. Rolling Friction: The resisting force when an object rolls over a surface. It is the smallest by far!) Tj
0 -18 Td
(Rule of thumb: Static Friction > Sliding Friction > Rolling Friction.) Tj
ET

% Real World Village Engineering
0.15 0.3 0.25 rg
BT
/F1 13 Tf
40 595 Td
(8. Real-World STEM in the Village: Engineering with Friction) Tj
ET

0.1 0.1 0.1 rg
BT
/F2 11 Tf
40 575 Td
(Everyday rural technologies showcase how friction is either enhanced or minimized:) Tj
0 -18 Td
(A. Bullock Carts & Wheel Bearings: Heavy wooden wheels reduce ground resistance through rolling motion.) Tj
0 -16 Td
(B. Village Well Pulley: A rotating wheel pulley with oiled axles lets farmers draw water with minimal force.) Tj
0 -16 Td
(C. Bicycle Chains: Applying grease to cycle chains replaces dry metal sliding friction with fluid lubrication.) Tj
0 -16 Td
(D. Footwear Tread Patterns: Rubber chappals and sports shoes have deep grooves to maximize traction.) Tj
ET

% Self Assessment Box
0.98 0.95 0.92 rg
40 440 515 90 re f
0.8 0.5 0.2 RG
1 w
40 440 515 90 re S

0.7 0.35 0.1 rg
BT
/F1 11 Tf
55 510 Td
(TRY THIS IN YOUR SURROUNDINGS (Active Inquiry):) Tj
/F2 10 Tf
0 -17 Td
(1. Rub a heavy book across a wooden table, then place 4 round pencils underneath it and push again.) Tj
0 -15 Td
(   Why does rolling the book over pencils require almost no effort compared to sliding?) Tj
0 -15 Td
(2. Sprinkle a pinch of talcum powder on a rough wooden board. How does it alter the sliding speed?) Tj
ET

% Summary
0.11 0.45 0.35 rg
BT
/F1 11 Tf
40 395 Td
(SUMMARY OF KEY PRINCIPLES) Tj
ET

0.1 0.1 0.1 rg
BT
/F2 10 Tf
40 375 Td
(* Friction is a necessary contact force: it prevents our shoes from slipping and allows vehicles to brake.) Tj
0 -15 Td
(* Microscopic irregularities interlock to oppose relative movement between solid surfaces.) Tj
0 -15 Td
(* Rolling friction is vastly smaller than sliding friction, making wheels the bedrock of mechanical engineering.) Tj
ET

% Footer Page 3
0.5 0.5 0.5 rg
BT
/F2 9 Tf
40 35 Td
(GaonLab Open Educational Resource -- Authorized Class 8 Companion Guide -- Page 3 of 3) Tj
ET
Q
`;

  const body1 = Buffer.from(page1Content.trim(), 'utf-8');
  const body2 = Buffer.from(page2Content.trim(), 'utf-8');
  const body3 = Buffer.from(page3Content.trim(), 'utf-8');

  const objList = [];

  objList[1] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objList[2] = `<< /Type /Pages /Kids [6 0 R 8 0 R 10 0 R] /Count 3 >>`;
  objList[3] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`;
  objList[4] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;
  objList[5] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>`;

  objList[6] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents 7 0 R >>`;
  objList[7] = `<< /Length ${body1.length} >>\nstream\n` + body1.toString('latin1') + `\nendstream`;

  objList[8] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents 9 0 R >>`;
  objList[9] = `<< /Length ${body2.length} >>\nstream\n` + body2.toString('latin1') + `\nendstream`;

  objList[10] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents 11 0 R >>`;
  objList[11] = `<< /Length ${body3.length} >>\nstream\n` + body3.toString('latin1') + `\nendstream`;

  let out = `%PDF-1.4\n%\xE2\xE3\xCF\xD3\n`;
  const xref = [0];

  for (let i = 1; i <= 11; i++) {
    xref[i] = Buffer.byteLength(out, 'latin1');
    out += `${i} 0 obj\n${objList[i]}\nendobj\n`;
  }

  const startxref = Buffer.byteLength(out, 'latin1');
  out += `xref\n0 12\n0000000000 65535 f \n`;
  for (let i = 1; i <= 11; i++) {
    const off = String(xref[i]).padStart(10, '0');
    out += `${off} 00000 n \n`;
  }

  out += `trailer\n<< /Size 12 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;
  return Buffer.from(out, 'latin1');
}

const dir = path.resolve('apps/web/public/documents');
fs.mkdirSync(dir, { recursive: true });
const targetFile = path.join(dir, 'forces-and-friction-guide.pdf');
const pdfBuffer = createPdf();
fs.writeFileSync(targetFile, pdfBuffer);
console.log(`Regenerated sample PDF at ${targetFile} (${pdfBuffer.length} bytes)`);
