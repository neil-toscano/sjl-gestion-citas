import { SectionDocument } from 'src/section-document/entities/section-document.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_permissions')
export class UserPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.permissions)
  user: User;

  @ManyToOne(() => SectionDocument, (section) => section.permissions)
  section: SectionDocument;

  @Column({ type: 'boolean', default: true })
  hasAccess: boolean;
}
