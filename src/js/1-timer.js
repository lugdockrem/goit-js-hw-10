import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const datetimePicker = document.querySelector('#datetime-picker');
const daysField = document.querySelector('[data-days]');
const hoursField = document.querySelector('[data-hours]');
const minutesField = document.querySelector('[data-minutes]');
const secondsField = document.querySelector('[data-seconds]');

let timerInterval = null;
let userSelectedDate = null;

// Функція для додавання ведучого нуля
function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

// Функція для конвертації мілісекунд у дні, години, хвилини, секунди
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для оновлення таймера
function updateTimer() {
  const now = new Date();
  const remainingTime = userSelectedDate - now;

  if (remainingTime <= 0) {
    clearInterval(timerInterval);

    // Встановлюємо всі поля в нулі
    daysField.textContent = '00';
    hoursField.textContent = '00';
    minutesField.textContent = '00';
    secondsField.textContent = '00';

    startBtn.disabled = true;
    datetimePicker.disabled = false; // Дозволяємо вибирати нову дату
    iziToast.success({
      title: 'Timer Complete!',
      message: 'The countdown has finished!',
      position: 'topRight',
    });
  } else {
    const { days, hours, minutes, seconds } = convertMs(remainingTime);

    // Оновлення інтерфейсу
    daysField.textContent = days.toString();
    hoursField.textContent = addLeadingZero(hours);
    minutesField.textContent = addLeadingZero(minutes);
    secondsField.textContent = addLeadingZero(seconds);
  }
}

// Ініціалізація Flatpickr
flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onChange(selectedDates) {
    userSelectedDate = selectedDates[0];
    const currentDate = new Date();

    if (userSelectedDate < currentDate) {
      console.log('Вибрана дата з минулого!');
      iziToast.error({
        title: 'Invalid Date!',
        message: 'Please choose a date in the future!',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      console.log('Вибрана дата з майбутнього!');
      startBtn.disabled = false;
    }
  },
});

// Обробник події для кнопки "Старт"
startBtn.addEventListener('click', () => {
  if (userSelectedDate && userSelectedDate > new Date()) {
    startBtn.disabled = true;
    datetimePicker.disabled = true;

    // Запуск таймера
    timerInterval = setInterval(updateTimer, 1000);

    iziToast.info({
      title: 'Timer Started!',
      message: 'The countdown has begun.',
      position: 'topRight',
    });
  }
});
