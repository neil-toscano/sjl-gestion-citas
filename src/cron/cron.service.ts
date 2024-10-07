import { Injectable } from '@nestjs/common';
import { CreateCronDto } from './dto/create-cron.dto';
import { UpdateCronDto } from './dto/update-cron.dto';
import { CronJob } from 'cron';
import { AppointmentService } from 'src/appointment/appointment.service';
import { AdminService } from 'src/admin/admin.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class CronService {
  private job: CronJob;

  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly adminService: AdminService,
    private readonly emailService: EmailService,
  ) {}
  onModuleInit() {
    this.job = new CronJob(
      '0 0 * * *',
      async () => {
        const date = new Date();
        const limaTime = new Intl.DateTimeFormat('es-PE', {
          timeZone: 'America/Lima',
          dateStyle: 'short',
          timeStyle: 'long',
        }).format(date);

        await this.expiredAppoinments();
      },
      null,
      true,
      'America/Lima',
    ); // Establece la zona horaria de Lima

    this.job.start();

    // const jobEveryMinute = new CronJob('*/2 * * * *', async () => {
    //   console.log('Se ejecuta cada minuto');
    //   await this.notifyObservedUsers();
    // }, null, true, 'America/Lima');
    // jobEveryMinute.start();
  }

  async expiredAppoinments() {
    const expiredAppointments =
      await this.appointmentService.expiredAppointments();
    expiredAppointments.forEach(async (appointment) => {
      const sectionId = appointment.section.id;
      const userId = appointment.reservedBy.id;

      await this.adminService.finalizeAndRemoveAll(userId, sectionId);
    });
    return {
      ok: true,
      msg: 'Se removió todos los documentos y citas',
    };
  }

  async notifyObservedUsers() {
    await this.emailService.notifyObservedUsers();
  }

  create(createCronDto: CreateCronDto) {
    return 'This action adds a new cron';
  }

  findAll() {
    return `This action returns all cron`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cron`;
  }

  update(id: number, updateCronDto: UpdateCronDto) {
    return `This action updates a #${id} cron`;
  }

  remove(id: number) {
    return `This action removes a #${id} cron`;
  }
}
