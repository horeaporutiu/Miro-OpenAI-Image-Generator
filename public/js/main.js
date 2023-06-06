function onSubmit(e) {
  e.preventDefault();

  document.querySelector('.msg').textContent = '';
  document.querySelector('#image').src = '';

  const prompt = document.querySelector('#promptInput').value;

  if (prompt === '') {
    alert('Please add some text');
    return;
  }

  generateImageRequest(prompt);
}

async function generateImageRequest(prompt) {
  try {
    showSpinner();

    const response = await fetch('/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt
      }),
    });

    if (!response.ok) {
      removeSpinner();
      throw new Error('That image could not be generated');
    }

    const image = await response.json();
    const imageUrl = image.data;

    document.querySelector('#image').src = imageUrl;

    removeSpinner();
    document.getElementById('miroBtn').style.visibility = 'visible';

  } catch (error) {
    //print error to front end
    document.querySelector('.msg').textContent = error;
  }
}

// // Add to Miro button handler
document.getElementById("miroBtn").addEventListener("click", function () {
  const image = document.querySelector('#image');
  let imgUrl = image.src
  addToMiro(imgUrl);
});

//addToMiro function which sends imgUrl to backend for REST API call
async function addToMiro(imgUrl) {

  try {

    // Send an HTTP request to the backend
    showSpinner();

    const response = await fetch('/addToMiro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imgUrl
      }),
    });

    removeSpinner();

  } catch (error) {
    document.querySelector('.msg').textContent = error;
  }
}


function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function removeSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

document.querySelector('#imagePrompt').addEventListener('submit', onSubmit);
document.getElementById('miroBtn').style.visibility = 'hidden';
