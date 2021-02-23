import { PrimaryGeneratedColumn } from 'typeorm';
import CreatedAtUpdatedAt from './CreatedAtUpdatedAt';

export default class Defaults extends CreatedAtUpdatedAt {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
