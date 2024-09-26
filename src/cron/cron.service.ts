import { Injectable } from '@nestjs/common';
import { CreateCronDto } from './dto/create-cron.dto';
import { UpdateCronDto } from './dto/update-cron.dto';
import { CronJob } from 'cron';
import { AppointmentService } from 'src/appointment/appointment.service';


@Injectable()
export class CronService {
  private job: CronJob;

  constructor(
    private readonly appointmentService: AppointmentService,
  ) {

  }
  onModuleInit() {
    this.job = new CronJob('0 0 * * *', () => {
      const date = new Date();
      const limaTime = new Intl.DateTimeFormat('es-PE', {
        timeZone: 'America/Lima',
        dateStyle: 'short',
        timeStyle: 'long',
      }).format(date);

      console.log(`Cron job ejecutado a la medianoche en Lima: ${limaTime}`);
      
      // Aquí va tu lógica de negocio
    }, null, true, 'America/Lima'); // Establece la zona horaria de Lima

    this.job.start();
  }

  async expiredAppoinments() {
    const expiredAppointments = await this.appointmentService.expiredAppointments();
    return expiredAppointments;
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
