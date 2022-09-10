import mongoose from 'mongoose'

mongoose.connect(process.env.MONGO_DB!);

export interface GoTinyObject {
  long: string;
  code: string;
  customCode: boolean;
  lastActive: number | null;
  createdAt: number;
  visited: number;
}

const goTinySchema = new mongoose.Schema<GoTinyObject>({
  long: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  customCode: {
    type: Boolean,
    required: false,
  },
  lastActive: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Number,
    required: true,
  },
  visited: {
    type: Number,
    required: true,
  },
}, { versionKey: false });

const GoTiny = mongoose.model<GoTinyObject>('GoTiny', goTinySchema, 'gotiny');

export default GoTiny;
