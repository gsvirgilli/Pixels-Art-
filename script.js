const randomColor = () => {
  let primeiraCor = Math.floor(Math.random() * 255);
  let segundaCor = Math.floor(Math.random() * 255);
  let terceiraCor = Math.floor(Math.random() * 255);
  const rgbColor = `rgb(${primeiraCor},${segundaCor},${terceiraCor})`;
  return rgbColor;
};

const array = [];
const cores = document.querySelectorAll('.color');
const paleta = () => {
  array[0] = cores[0].style.backgroundColor = 'black';
  array[1] = cores[1].style.backgroundColor = randomColor();
  array[2] = cores[2].style.backgroundColor = randomColor();
  array[3] = cores[3].style.backgroundColor = randomColor();
};

if (!localStorage.getItem('colorPalette')) {
  paleta();
}

const pegandoCores = () => {
  const dadosDCores = JSON.parse(localStorage.getItem('colorPalette'));
  array[0] = cores[0].style.backgroundColor = dadosDCores[0];
  array[1] = cores[1].style.backgroundColor = dadosDCores[1];
  array[2] = cores[2].style.backgroundColor = dadosDCores[2];
  array[3] = cores[3].style.backgroundColor = dadosDCores[3];
};

if (localStorage.getItem('colorPalette')) {
  pegandoCores();
}

const btn = document.querySelector('#button-random-color');

btn.addEventListener('click', () => {
  paleta();
  localStorage.setItem('colorPalette', JSON.stringify(array));
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
  const larguraTotal = window.innerWidth;
  const larguraDaDivPai = larguraTotal * 0.6;
  const larguraPixel = larguraDaDivPai / tamanho;
  for (let index = 0; index < tamanho; index += 1) {
    let outro = document.createElement('div');
    for (let index1 = 0; index1 < tamanho; index1 += 1) {
      outro = document.createElement('div');
      outro.className = 'pixel';
      outro.style.width = larguraPixel + 'px';
      outro.style.height = larguraPixel + 'px';
      pai.appendChild(outro);
    }
  }
  console.log(pai.children.length);
  console.log(larguraPixel);
};

if (localStorage.getItem('boardSize')) {
  let tamanho = localStorage.getItem('boardSize');
  criandoQuadro(tamanho);
}
if (!localStorage.getItem('boardSize')) {
  criandoQuadro(input);
}
/* const addPixelClickEvent = () => {
  const pixel = document.querySelectorAll('.pixel');
  for (let quadro of pixel) {
    quadro.addEventListener('click', (event) => {
      const selected = document.querySelector('.selected');
      if (selected) {
        event.target.style.backgroundColor = selected.style.backgroundColor;
        const pixel1 = [];
        for (let index = 0; index < pixel.length; index += 1) {
          pixel1[index] = pixel[index].style.backgroundColor;
        }
        localStorage.setItem('pixelBoard', JSON.stringify(pixel1));
      }
    });
  }
}; */

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

/* const addPixelClickEvent = () => {
  const pixels = document.querySelectorAll('.pixel');
  pixels.forEach(pixel => {
    pixel.addEventListener('click', () => {
      const selectedColor = getSelectedColor();
      pixel.style.backgroundColor = selectedColor;
      savePixelData();
    })
  })
}; */

const addPixelClickEvent = () => {
  const pixels = document.querySelectorAll('.pixel');
  let isDragging = false;

  pixels.forEach(pixel => {
    pixel.addEventListener('mousedown', () => {
      isDragging = true;
      const selectedColor = getSelectedColor();
      pixel.style.backgroundColor = selectedColor;
      savePixelData();
    })

    pixel.addEventListener('mouseup', () => {
      isDragging = false;
    });

    pixel.addEventListener('mouseover', (event) => {
      if (isDragging && event.buttons === 1) {
        const selectedColor = getSelectedColor();
        pixel.style.backgroundColor = selectedColor;
        pixel.classList.add('painted');
        savePixelData();
      }
    })
  })
}

addPixelClickEvent();

btnGerarQuadro.addEventListener('click', () => {
  input = document.querySelector('#board-size').value;
  if (input >= 5 && input <= 50) {
    criandoQuadro(input);
    addPixelClickEvent();
  } else if (input < 5 && input !== '') {
    criandoQuadro(5);
    addPixelClickEvent();
  } else if (input > 50) {
    criandoQuadro(100);
    addPixelClickEvent();
  } else {
    alert('Board inválido!');
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

/* const desenhosAleatorios = () => {
  const array = [];
  let randondesenho = Math.floor(Math.random() * array.length);
  return array[randondesenho];
} */
