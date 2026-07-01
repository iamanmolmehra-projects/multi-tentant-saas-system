import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditNoteEntity } from './entities/credit-note.entity';
import { CreditNotesController } from './credit-notes.controller';
import { CreditNotesService } from './credit-notes.service';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreditNoteEntity]),
    InvoicesModule,
  ],
  controllers: [CreditNotesController],
  providers: [CreditNotesService],
  exports: [CreditNotesService],
})
export class CreditNotesModule {}
