import { getCart, getCartTotal, clearCart } from './cart.js';
import { showToast } from './toast.js';
import { WHATSAPP_NUMBER } from './config.js';

const DEFAULT_STEP_MINUTES = 30;

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function buildHours(start, end, step) {
  const hours = [];
  for (let t = toMinutes(start); t <= toMinutes(end); t += step) {
    const hh = String(Math.floor(t / 60)).padStart(2, '0');
    const mm = String(t % 60).padStart(2, '0');
    hours.push(`${hh}:${mm}`);
  }
  return hours;
}

function todayISO() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function formatDate(isoDate) {
  return isoDate.split('-').reverse().join('/');
}

async function loadAvailability() {
  const response = await fetch('/json/disponibilidad.json');
  if (!response.ok) throw new Error('No se pudo cargar disponibilidad.json');
  return response.json();
}

function getSchedule(station, availability) {
  return {
    inicio: station.inicio ?? availability.horario.inicio,
    fin: station.fin ?? availability.horario.fin,
    representante: station.representante ?? availability.representante,
    paso: availability.horario.intervaloMinutos ?? DEFAULT_STEP_MINUTES,
  };
}

function validateField(field) {
  const valid = field.checkValidity();
  field.classList.toggle('field-valid', valid);
  field.classList.toggle('field-invalid', !valid);
  return valid;
}

function buildOrder(form, station) {
  const value = (id) => form.querySelector(`#${id}`).value.trim();

  return {
    nombre: value('name'),
    dni: value('dni'),
    telefono: value('phone'),
    email: value('email'),
    estacion: station.nombre,
    fecha: value('date'),
    hora: value('hour'),
    representante: value('representante'),
    productos: getCart(),
    total: getCartTotal(),
  };
}

function buildOrderLink(order) {
  const lines = order.productos.map(
    (item) =>
      `- ${item.nombre} (x${item.quantity}) - S/${(item.precio * item.quantity).toFixed(2)}`
  );

  const message = [
    'Hola, quiero confirmar este pedido para recojo en estación del tren:',
    '',
    ...lines,
    `Total: S/${order.total.toFixed(2)}`,
    '',
    `Nombre: ${order.nombre}`,
    `DNI: ${order.dni}`,
    `Teléfono: ${order.telefono}`,
    `Correo: ${order.email}`,
    `Estación: ${order.estacion}`,
    `Fecha: ${formatDate(order.fecha)}`,
    `Hora: ${order.hora}`,
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function renderConfirmation(order, link) {
  const summary = document.getElementById('resumen-pedido-modal');
  summary.innerHTML = '';

  const rows = [
    ['Nombre', order.nombre],
    ['Estación', order.estacion],
    ['Fecha', formatDate(order.fecha)],
    ['Hora', order.hora],
    ['Representante', order.representante],
    ['Total', `S/${order.total.toFixed(2)}`],
  ];

  rows.forEach(([label, text]) => {
    const row = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    row.append(strong, text);
    summary.appendChild(row);
  });

  document.getElementById('enviar-whatsapp').href = link;
  document.getElementById('modal-confirmacion').hidden = false;
}

export async function initStationForm() {
  const form = document.getElementById('contact-form');
  const branch = document.getElementById('branch');
  const hour = document.getElementById('hour');
  const representante = document.getElementById('representante');
  const dateInput = document.getElementById('date');
  const modal = document.getElementById('modal-confirmacion');

  if (!form || !branch || !hour || !representante || !dateInput || !modal) {
    return;
  }

  dateInput.min = todayISO();

  let availability;
  try {
    availability = await loadAvailability();
  } catch (error) {
    console.error('Error al cargar la disponibilidad:', error);
    showToast(
      'No pudimos cargar las estaciones. Intenta de nuevo más tarde.',
      'error',
      5000
    );
    return;
  }

  const stations = availability.estaciones;

  stations.forEach((station) => {
    const option = document.createElement('option');
    option.value = station.id;
    option.textContent = station.nombre;
    branch.appendChild(option);
  });

  branch.addEventListener('change', () => {
    hour.innerHTML =
      '<option value="" disabled selected>Selecciona una hora</option>';
    representante.value = '';

    const station = stations.find((item) => item.id === branch.value);
    if (!station) return;

    const schedule = getSchedule(station, availability);
    representante.value = schedule.representante;

    buildHours(schedule.inicio, schedule.fin, schedule.paso).forEach((time) => {
      const option = document.createElement('option');
      option.value = time;
      option.textContent = time;
      hour.appendChild(option);
    });
  });

  form.querySelectorAll('input, select').forEach((field) => {
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('change', () => validateField(field));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = [...form.querySelectorAll('input, select')];
    const allValid = fields.map((field) => validateField(field)).every(Boolean);

    if (!allValid) {
      showToast('Completa los campos marcados en rojo.', 'error');
      return;
    }

    const station = stations.find((item) => item.id === branch.value);
    const order = buildOrder(form, station);
    renderConfirmation(order, buildOrderLink(order));
  });

  document.getElementById('btn-cerrar-modal').addEventListener('click', () => {
    modal.hidden = true;
  });

  document.getElementById('enviar-whatsapp').addEventListener('click', () => {
    clearCart();
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') modal.hidden = true;
  });
}
