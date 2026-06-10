// Personal Brand OS — domain types shared by public + admin slices.

export type PostStatus = "draft" | "scheduled" | "published";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // markdown-ish; rendered as paragraphs
  cover: string;
  tag: string;
  author: string;
  status: PostStatus;
  publishedAt: number;
  views: number;
  readMin: number;
};

export type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  cover: string;
  blurb: string;
  problem: string;
  approach: string;
  result: string;
  publishedAt: number;
};

export type Service = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceLabel: string; // "Rp 4.5jt"
  period: string; // "/bulan"
  bullets: string[];
  featured: boolean;
  // Commerce (additive): fixed IDR amount. Services without it are
  // retainer/quote (book-only) and can't be added to the cart.
  priceNumber?: number;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  fileLabel: string; // "PDF · 38 hal"
  gated: boolean;
  downloads: number;
};

export type LeadStatus = "new" | "contacted" | "closed";

export type Lead = {
  id: string;
  name: string;
  email: string;
  topic: string;
  source: string; // "Contact form" | "Service: <name>" | "Lead magnet" | "Newsletter" | "Chatbot"
  message?: string;
  ts: number;
  status: LeadStatus;
};

export type CommentStatus = "pending" | "approved" | "spam";

export type Comment = {
  id: string;
  postId: string;
  postTitle: string;
  author: string;
  email: string;
  body: string;
  status: CommentStatus;
  aiFlag?: "spam" | "toxic" | null;
  ts: number;
};

export type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

export type Subscriber = {
  id: string;
  email: string;
  status: SubscriberStatus;
  source: string; // "footer" | "lead-magnet" | "post:<slug>"
  ts: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
};

export type ChatSession = {
  id: string;
  visitorId: string;
  startedAt: number;
  flagged: boolean;
  messages: ChatMessage[];
};

export type State = {
  posts: Post[];
  portfolio: PortfolioItem[];
  services: Service[];
  resources: Resource[];
  leads: Lead[];
  comments: Comment[];
  subscribers: Subscriber[];
  chatSessions: ChatSession[];
  /** O-wave: public pages CRUD slice. */
  pages: import("@/components/templates/_shared/pages/types").PageEntry[];
  /** AB-wave: home-page section composition. Ordered + toggleable. */
  landingSections: import("@/components/templates/_shared/landing/types").LandingSection[];
};

export type LandingSection = import("@/components/templates/_shared/landing/types").LandingSection;
export type LandingSectionKind = import("@/components/templates/_shared/landing/types").LandingSectionKind;
export type LandingAction = import("@/components/templates/_shared/landing/types").LandingAction;

export type Action =
  | import("@/components/templates/_shared/pages/types").PagesAction
  | LandingAction
  | { type: "post.upsert"; post: Post }
  | { type: "post.delete"; id: string }
  | { type: "post.view"; id: string }
  | { type: "portfolio.upsert"; item: PortfolioItem }
  | { type: "portfolio.delete"; id: string }
  | { type: "service.upsert"; svc: Service }
  | { type: "service.delete"; id: string }
  | { type: "resource.upsert"; res: Resource }
  | { type: "resource.delete"; id: string }
  | { type: "resource.download"; id: string }
  | { type: "lead.create"; lead: Lead }
  | { type: "lead.update"; id: string; patch: Partial<Lead> }
  | { type: "lead.delete"; id: string }
  | { type: "comment.create"; comment: Comment }
  | { type: "comment.upsert"; comment: Comment }
  | { type: "comment.moderate"; id: string; status: CommentStatus }
  | { type: "comment.delete"; id: string }
  | { type: "subscriber.create"; sub: Subscriber }
  | { type: "subscriber.upsert"; sub: Subscriber }
  | { type: "subscriber.confirm"; id: string }
  | { type: "subscriber.unsubscribe"; id: string }
  | { type: "subscriber.delete"; id: string }
  | { type: "chat.session.start"; session: ChatSession }
  | { type: "chat.session.upsert"; session: ChatSession }
  | { type: "chat.session.delete"; id: string }
  | { type: "chat.message"; sessionId: string; msg: ChatMessage; flag?: boolean }
  | { type: "hydrate"; state: State }
  | { type: "reset" };
