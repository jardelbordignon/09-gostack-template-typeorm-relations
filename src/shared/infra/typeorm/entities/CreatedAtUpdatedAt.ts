import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export default class CreatedAtUpdatedAt {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
