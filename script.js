// Função para gerar uma cor aleatória
const randomColor = () => {
  let primeiraCor = Math.floor(Math.random() * 256);
  let segundaCor = Math.floor(Math.random() * 256);
  let terceiraCor = Math.floor(Math.random() * 256);
  const rgbColor = `rgb(${primeiraCor},${segundaCor},${terceiraCor})`;
  return rgbColor;
};

// Função para criar as cores na paleta
const criandoCores = () => {
  const paleta = document.querySelector('#color-palette');
  for (let index = 0; index < 23; index += 1) {
    const novaCor = document.createElement('div');
    novaCor.classList.add('color');
    paleta.appendChild(novaCor);
  }
};

criandoCores();

const array = [];
const cores = document.querySelectorAll('.color');
const numCores = cores.length;

const paleta = () => {
  array[1] = cores[1].style.backgroundColor = 'black';
  array[0] = cores[0].style.backgroundColor = 'white';
  for (let index = 2; index < numCores; index += 1) {
    let novaCor = randomColor();
    while (array.includes(novaCor)) {
      novaCor = randomColor();
    }
    array[index] = novaCor;
    cores[index].style.backgroundColor = novaCor;
  }
};

if (!localStorage.getItem('colorPalette')) {
  paleta();
}

const pegandoCores = () => {
  const dadosDCores = JSON.parse(localStorage.getItem('colorPalette'));
  array[0] = cores[0].style.backgroundColor = dadosDCores[0];
  for (let index = 1; index < numCores; index += 1) {
    array[index] = cores[index].style.backgroundColor = dadosDCores[index];
  }
};

if (localStorage.getItem('colorPalette')) {
  pegandoCores();
}

const btn = document.querySelector('#button-random-color');

btn.addEventListener('click', () => {
  paleta();
  localStorage.setItem('colorPalette', JSON.stringify(Array.from(cores).map(cor => cor.style.backgroundColor)));
});

const pai = document.querySelector('#pixel-board');
let input = 5;
const btnGerarQuadro = document.querySelector('#generate-board');

for (let paleta of cores) {
  paleta.addEventListener('click', (event) => {
    const selected = document.querySelector('.selected');
    if (selected) {
      selected.classList.remove('selected');
    }
    event.target.classList.add('selected');
  });
}

const criandoQuadro = (tamanho) => {
  pai.innerHTML = '';
  const larguraTotal = window.innerWidth / (window.innerWidth / document.documentElement.clientWidth);
  let larguraDaDivPai;

  if (window.innerWidth <= 768) {
    larguraDaDivPai = larguraTotal * 0.9;
  } else {
    larguraDaDivPai = larguraTotal * 0.4;
  }
  const larguraPixel = larguraDaDivPai / tamanho;
   pai.style.setProperty('--tamanho', tamanho);

  for (let index = 0; index < tamanho; index += 1) {
    let linha = document.createElement('div'); // Adicione uma nova div para cada linha
    linha.className = 'linha'; // Defina uma classe para a linha

    for (let index1 = 0; index1 < tamanho; index1 += 1) {
      let pixel = document.createElement('div');
      pixel.className = 'pixel';
      pixel.style.width = larguraPixel + 'px';
      pixel.style.height = larguraPixel + 'px';
      linha.appendChild(pixel); // Adicione o pixel à linha
    }

    pai.appendChild(linha); // Adicione a linha ao quadro
  }
};

if (localStorage.getItem('boardSize')) {
  let tamanho = localStorage.getItem('boardSize');
  criandoQuadro(tamanho);
}
if (!localStorage.getItem('boardSize')) {
  criandoQuadro(input);
}


const getSelectedColor = () => {
  const selected = document.querySelector('.selected');
  if (selected) {
    return selected.style.backgroundColor;
  }
  return null;
}

const savePixelData = () => {
  const pixels = document.querySelectorAll('.pixel');
  const pixelData = [];
  pixels.forEach(pixel => {
    pixelData.push(pixel.style.backgroundColor);
  })
  localStorage.setItem('pixelBoard', JSON.stringify(pixelData));
}

const paintedPixelIndices = []; 

const addPixelClickEvent = () => {
  const pixels = document.querySelectorAll('.pixel');
  let isDragging = false;

  pixels.forEach((pixel, index) => {
    pixel.addEventListener('mousedown', () => {
      isDragging = true;
      const selectedColor = getSelectedColor();
      pixel.style.backgroundColor = selectedColor;
      pixel.classList.add('painted');
      paintedPixelIndices.push(index); 
      savePixelData();
    });

    pixel.addEventListener('mouseup', () => {
      isDragging = false;
    });

    pixel.addEventListener('mousemove', (event) => {
      if (isDragging) {
        const selectedColor = getSelectedColor();
        event.target.style.backgroundColor = selectedColor;
        event.target.classList.add('painted');
        savePixelData();
      }
    });

    pixel.addEventListener('touchstart', (event) => {
      event.preventDefault();
      isDragging = true;
      const selectedColor = getSelectedColor();
      event.target.style.backgroundColor = selectedColor;
      event.target.classList.add('painted');
      paintedPixelIndices.push(index);
      savePixelData();
    });

    pixel.addEventListener('touchmove', (event) => {
      event.preventDefault();
      if (isDragging) {
        const selectedColor = getSelectedColor();
        event.target.style.backgroundColor = selectedColor;
        event.target.classList.add('painted');
        savePixelData();
      }
    });

    pixel.addEventListener('touchend', () => {
      isDragging = false;
    });
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
};

///             asdaaaaaaaaaaaaa
const undoLastPaintedPixel = () => {
  const pixels = document.querySelectorAll('.pixel');

  if (paintedPixelIndices.length > 0) {
    const lastPaintedIndex = paintedPixelIndices.pop(); // Remove o último índice pintado

    if (pixels[lastPaintedIndex]) {
      pixels[lastPaintedIndex].style.backgroundColor = 'white';
      pixels[lastPaintedIndex].classList.remove('painted');
      savePixelData(); // Salva os dados atualizados após desfazer
    }
  }
};

const undoButton = document.querySelector('#undo-button');

undoButton.addEventListener('click', () => {
  undoLastPaintedPixel();
});

// Chame a função para adicionar os eventos de clique e arraste aos pixels
addPixelClickEvent();

btnGerarQuadro.addEventListener('click', () => {
  const pixels = document.querySelectorAll('.pixel');
    for (let index = 0; index < pixels.length; index += 1) {
      pixels[index].style.backgroundColor = 'white';
    }
  input = document.querySelector('#board-size').value;
  if (input >= 5 && input <= 50) {
    criandoQuadro(input);
    addPixelClickEvent();
  } else if (input < 5 && input !== '') {
    criandoQuadro(10);
    addPixelClickEvent();
  } else if (input > 50) {
    alert('Tamanho Muito Grande!');
  }else {
    alert('Digite o Tamanho!');
  }
  localStorage.setItem('boardSize', input);
});

const pixel = document.querySelectorAll('.pixel');
if (localStorage.getItem('pixelBoard')) {
  const pixelboard = JSON.parse(localStorage.getItem('pixelBoard'));
  for (let index = 0; index < pixel.length; index += 1) {
    pixel[index].style.backgroundColor = pixelboard[index];
  }
}

const btn2 = document.querySelectorAll('#clear-board');
for (let clear of btn2) {
  clear.addEventListener('click', () => {
    const pixels = document.querySelectorAll('.pixel');
    for (let index = 0; index < pixels.length; index += 1) {
      pixels[index].style.backgroundColor = 'white';
    }
  });
}
