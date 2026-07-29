const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  console.log('Generating PDF from TECHNICAL_DOCUMENTATION.md...');
  // Using npx md-to-pdf
  execSync('npx -y md-to-pdf TECHNICAL_DOCUMENTATION.md', { stdio: 'inherit' });
  console.log('PDF generated successfully!');
} catch (e) {
  console.error('PDF generation error:', e.message);
}
