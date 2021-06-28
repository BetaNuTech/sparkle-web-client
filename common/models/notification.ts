interface notification {
  title: string;
  summary: string;
  creator?: string; // user id
  property?: string; // property id
  markdownBody?: string;
  userAgent?: string;
}

export default notification;
