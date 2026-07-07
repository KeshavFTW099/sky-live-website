import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  hero: Record<string, any>;
  cta: Record<string, any>;
  sales?: Record<string, any>;
  footer: Record<string, any>;
  aboutUs: Record<string, any>;
  director: Record<string, any>;
  careers: Record<string, any>;
  statistics: Array<Record<string, any>>;
  services: Array<Record<string, any>>;
  whatWeDo: Record<string, any>;
  highlights: Array<Record<string, any>>;
  categories: Array<Record<string, any>>;
  products: Array<Record<string, any>>;
  legal?: Record<string, any>;
  serviceCategories?: Array<Record<string, any>>;
  homepageLayout?: Array<Record<string, any>>;
}

const ContentSchema: Schema = new Schema(
  {
    hero: { type: Schema.Types.Mixed, required: true },
    cta: { type: Schema.Types.Mixed, required: true },
    sales: { type: Schema.Types.Mixed },
    footer: { type: Schema.Types.Mixed, required: true },
    aboutUs: { type: Schema.Types.Mixed, required: true },
    director: { type: Schema.Types.Mixed, required: true },
    careers: { type: Schema.Types.Mixed, required: true },
    statistics: { type: [Schema.Types.Mixed], default: [] },
    services: { type: [Schema.Types.Mixed], default: [] },
    whatWeDo: { type: Schema.Types.Mixed, required: true },
    highlights: { type: [Schema.Types.Mixed], default: [] },
    categories: { type: [Schema.Types.Mixed], default: [] },
    products: { type: [Schema.Types.Mixed], default: [] },
    legal: { type: Schema.Types.Mixed },
    serviceCategories: { type: [Schema.Types.Mixed], default: [] },
    homepageLayout: { type: [Schema.Types.Mixed] }
  },
  { timestamps: true, collection: 'content' }
);

import { Model } from 'mongoose';

const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);
export default Content;
