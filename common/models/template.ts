interface template {
  id: string;
  name: string;
  description: string;
  category: string; // template category relationship
  trackDeficientItems: boolean;
  properties?: Array<string>;
  sections?: any;
  items?: any;
}

export default template;
