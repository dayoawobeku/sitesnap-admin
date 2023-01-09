const INDUSTRIES = [
  {value: 'Fintech', label: 'Fintech'},
  {value: 'Healthtech', label: 'Healthtech'},
  {value: 'Onboarding', label: 'Onboarding'},
  {value: 'Edutech', label: 'Edutech'},
  {value: 'Data Tech', label: 'Data Tech'},
  {value: 'Artificial intelligence', label: 'Artificial intelligence'},
  {value: 'eCommerce', label: 'eCommerce'},
  {value: 'Social media', label: 'Social media'},
  {value: 'Portfolio', label: 'Portfolio'},
  {value: 'NGO', label: 'NGO'},
  {value: 'Blog', label: 'Blog'},
  {value: 'Automotive', label: 'Automotive'},
  {value: 'Manufacturing', label: 'Manufacturing'},
  {value: 'Property', label: 'Property'},
  {value: 'Web3', label: 'Web3'},
  {value: 'Virtual Reality', label: 'Virtual Reality'},
  {value: 'Augmented Reality', label: 'Augmented Reality'},
  {value: 'Transportation', label: 'Transportation'},
  {value: 'Agency', label: 'Agency'},
];

const PAGES = [
  {value: 'Homepage & Landing page', label: 'Homepage & Landing page'},
  {value: 'About us', label: 'About us'},
  {value: 'Contact us', label: 'Contact us'},
  {value: 'Features', label: 'Features'},
  {value: 'Plans and Pricing', label: 'Plans and Pricing'},
  {value: 'Blog', label: 'Blog'},
  {value: 'Blog Post', label: 'Blog Post'},
  {value: 'Careers', label: 'Careers'},
  {value: 'Team', label: 'Team'},
  {value: 'Frequently Asked (FAQ)', label: 'Frequently Asked (FAQ)'},
  {value: 'Login & Sign in', label: 'Login & Sign in'},
  {value: 'Create account & Sign up', label: 'Create account & Sign up'},
];

function slugify(string: string) {
  return string
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export {INDUSTRIES, PAGES, slugify};
