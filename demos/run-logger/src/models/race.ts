import mongoose from 'mongoose';
import { UserDoc } from './user';

interface RaceAttrs {
  userId: string;
  raceName: string;
  length: number;
  time: number;
}

// An interface that describes the properties that the
// Race Model has

interface RaceModel extends mongoose.Model<RaceDoc> {
  build(attrs: RaceAttrs): RaceDoc;
}

// Interface that describes the properties a Race Document has

interface RaceDoc extends mongoose.Document {
  raceName: string;
  length: number;
  time: number;
  userId: string;
}

const RaceSchema = new mongoose.Schema<RaceDoc, RaceModel>(
  {
    raceName: {
      type: String,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // This allows you to change the document and returned value when sending data back
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

RaceSchema.statics.build = (attrs: RaceAttrs) => {
  return new Race(attrs);
};

const Race = mongoose.model<RaceDoc, RaceModel>('Race', RaceSchema);

export { Race };
