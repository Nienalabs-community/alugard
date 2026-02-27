import { alugard } from './index';
import './alugard.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f7f9fc;
      color: #333;
      padding: 40px;
    }
    h1 {
      text-align: center;
      margin-bottom: 40px;
      color: #2c3e50;
    }
    .wrapper {
      display: flex;
      justify-content: center;
      gap: 30px;
    }
    .container {
      background: #e2e8f0;
      border-radius: 8px;
      padding: 15px;
      width: 300px;
      min-height: 400px;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
    }
    .container h2 {
      margin-top: 0;
      font-size: 16px;
      color: #4a5568;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 15px;
      text-align: center;
      pointer-events: none;
    }
    .item {
      background: white;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      cursor: grab;
      user-select: none;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .item:hover {
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transform: translateY(-1px);
    }
    .item:active {
      cursor: grabbing;
    }
    .ad-transit {
      opacity: 0.4;
      background: #cbd5e1;
      border: 2px dashed #94a3b8;
      box-shadow: none;
    }
    .ad-mirror {
      opacity: 0.9;
      box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
      cursor: grabbing !important;
      transform: rotate(2deg);
    }
  </style>

  <h1>Alugard Drop Testing</h1>
  <div class="wrapper">
    <div id="todo" class="container">
      <h2>To Do</h2>
      <div class="item">Research Dragula API</div>
      <div class="item">Implement modern Pointer Events</div>
      <div class="item">Solve CSS transitions</div>
    </div>
    <div id="done" class="container">
      <h2>Done</h2>
      <div class="item">Setup project</div>
      <div class="item">Write unit tests</div>
    </div>
  </div>
`;

const todo = document.getElementById('todo')!;
const done = document.getElementById('done')!;

const drake = alugard([todo, done], {
  invalid: (el) => {
    return el.tagName === 'H2';
  }
});

drake.on('drag', (el) => {
  console.log('Dragging:', el.textContent?.trim());
});

drake.on('drop', (el, target, source) => {
  console.log('Dropped:', el.textContent?.trim(), 'into', target.id, 'from', source.id);
});
