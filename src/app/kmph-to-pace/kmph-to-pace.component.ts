import { DecimalPipe } from '@angular/common';
import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kmph-to-pace',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './kmph-to-pace.component.html',
  styleUrls: ['./kmph-to-pace.component.css']
})
export class KmphToPaceComponent {
  public readonly commonSpeeds = [10, 11, 12, 13, 14, 15, 16, 20];
  public speedKmh = signal(10); // Default speed

  public paceMinKm = computed(() => this.calculatePace(this.speedKmh()));

  public raceTimes = computed(() => ({
    oneK: this.calculateRaceTime(1),
    marathon: this.calculateRaceTime(42.195),
    halfMarathon: this.calculateRaceTime(21.0975),
    thirtyK: this.calculateRaceTime(30),
    tenMiles: this.calculateRaceTime(16.0934),
    fifteen: this.calculateRaceTime(15),
    tenK: this.calculateRaceTime(10),
    fiveK: this.calculateRaceTime(5)
  }));

  public activeSpeed = computed(() => {
    const current = this.speedKmh();

    return this.commonSpeeds.includes(current) ? current : null;
  });

  private calculatePace(speed: number): string {
    if (speed <= 0) return '0:00';

    const minutesPerKm = 60 / speed;
    const minutes = Math.floor(minutesPerKm);
    const seconds = Math.round((minutesPerKm - minutes) * 60);

    // Handle cases where seconds round to 60
    if (seconds === 60) {
      return `${minutes + 1}:00`;
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  public onPaceChange(newPace: string): void {
    // Validate pace format (mm:ss)
    if (!/^\d{1,2}:[0-5]\d$/.test(newPace)) return;

    const [minutes, seconds] = newPace.split(':').map(Number);
    const totalMinutes = minutes + (seconds / 60);
    const calculatedSpeed = 60 / totalMinutes;

    if (!isNaN(calculatedSpeed)) {
      this.speedKmh.set(parseFloat(calculatedSpeed.toFixed(2)));
    }
  }

  private calculateRaceTime(distanceKm: number): string {
    const speed = this.speedKmh();
    if (speed <= 0) return '0:00:00';

    const totalHours = distanceKm / speed;
    const hours = Math.floor(totalHours);
    const remainingMinutes = (totalHours - hours) * 60;
    const minutes = Math.floor(remainingMinutes);
    const seconds = Math.round((remainingMinutes - minutes) * 60);

    // Handle overflow seconds
    const adjustedMinutes = seconds === 60 ? minutes + 1 : minutes;
    const adjustedSeconds = seconds === 60 ? 0 : seconds;

    return `${hours}:${adjustedMinutes.toString().padStart(2, '0')}:${adjustedSeconds.toString().padStart(2, '0')}`;
  }

  public setCommonSpeed(speed: number): void {
    this.speedKmh.set(speed);
  }
}
