let pageIndex = 0;
const pages = ['head', 'body', 'bubble', 'background', 'text', 'caption'];

const awsPrefix = 'https://s3.amazonaws.com/codecademy-content/programs/build-apis/projects/build-apis-mini-capstone-project/';

let current = {
  head: 'happy',
  body: 'plus',
  bubble: 'statement',
  background: 'space',
  text: 'Your text here!',
  caption: 'caption',
};

let defaults = {
  head: 'happy',
  body: 'plus',
  bubble: 'statement',
  background: 'space',
  text: 'Your text here!',
  caption: 'caption',
};

let strips = [];

const options = {
  head: [
    {
      name: 'happy',
      src: `${awsPrefix}img/happy.svg`,
    },
    {
      name: 'sad',
      src: `${awsPrefix}img/sad.svg`,
    },
    {
      name: 'angry',
      src: `${awsPrefix}img/angry.svg`,
    },
  ],
  body: [
    {
      name: 'plus',
      src: `${awsPrefix}img/body1.svg`,
    },
    {
      name: 'minus',
      src: `${awsPrefix}img/body2.svg`,
    },
    {
      name: 'x',
      src: `${awsPrefix}img/body3.svg`,
    },
  ],
  bubble: [
    {
      name: 'statement',
      src: `${awsPrefix}img/thought_bubble_1.svg`,
    },
    {
      name: 'question',
      src: `${awsPrefix}img/thought_bubble_2.svg`,
    },
    {
      name: 'sound',
      src: `${awsPrefix}img/thought_bubble_3.svg`,
    },
  ],
  background: [
    {
      name: 'space',
      src: `${awsPrefix}img/bg1.svg`,
      bgColor: '#3A6AE6',
    },
    {
      name: 'mountains',
      src: `${awsPrefix}img/bg2.svg`,
      bgColor: '#00DAB7',
    },
    {
      name: 'boat',
      src: `${awsPrefix}img/bg3.svg`,
      bgColor: '#7A67F9',
    },
  ],
};

const redrawSelections = () => {
  let page = pages[pageIndex];
  // Set text
  $('#navigation-label').text(page);
  // Set images
  if (pageIndex < 4) {
    $('#textboxes').addClass('invisible');
    $('#triple-selector').removeClass('invisible');
    $('.selector > img').each(function(index) {
      $(this).attr('src', `${options[page][index].src}`);
    });
  } else {
    $('#textboxes').removeClass('invisible');
    $('#triple-selector').addClass('invisible');
    $('#text-input').val(current[page]);
  }
};

const redrawText = () => {
  $('#text').text(current.text);
  $('#caption').text(current.caption);
};

const populateStrips = () => {
  strips.forEach((strip) => {
    $('ul').append(`<li id="strip-button-${strip.id}" class="button strip-button">${strip.caption}</li>`);
  });
};

const addStrip = (newStrip) => {
  $('ul').append(`<li id="strip-button-${newStrip.id}" class="button strip-button">${newStrip.caption}</li>`);
  strips.push({
    head: newStrip.head,
    body: newStrip.body,
    bubble: newStrip.bubble_type,
    background: newStrip.background,
    text: newStrip.bubble_text,
    caption: newStrip.caption,
    id: newStrip.id,
  });
};

const findInArrayByName = (arr, name) => {
  return arr.find((element) => {
    return element.name === name;
  });
};

const drawStrip = () => {
  $('#head').attr('src', `${findInArrayByName(options.head, current.head).src}`);
  $('#body').attr('src', `${findInArrayByName(options.body, current.body).src}`);
  $('#bubble').attr('src', `${findInArrayByName(options.bubble, current.bubble).src}`);
  $('#background').attr('src', `${findInArrayByName(options.background, current.background).src}`);
  $('.display-container').css('background-color', `${findInArrayByName(options.background, current.background).bgColor}`);
  redrawText();
};

const getStrips = () => {
  $.get('/strips', function(data) {
    strips = data.strips.map((stripFromDb) => {
      return {
        head: stripFromDb.head,
        body: stripFromDb.body,
        bubble: stripFromDb.bubble_type,
        background: stripFromDb.background,
        text: stripFromDb.bubble_text,
        caption: stripFromDb.caption,
        id: stripFromDb.id,
      }
    });
    populateStrips();
  });
};

$(() => {
  getStrips();

  // Handle selection mapping
  $('.selector').on('mousedown', function() {
    $('.selector').removeClass('selected');
    $(this).addClass('selected');
  });

  // Set image on page
  $('.selector').on('mousedown', function() {
    let index = $(this).attr('id').split('-')[1] - 1;
    let selector = pages[pageIndex];
    let clickedObj = options[selector][index];
    $(`#${selector}`).attr('src', `${clickedObj.src}`);
    current[selector] = clickedObj.name;
    if (selector === 'background') {
      $('.display-container').css('background-color', clickedObj.bgColor);
    }
    if (selector === 'bubble' && clickedObj.name === 'sound') {
      $(`#${selector}`).addClass('effect');
    } else {
      $(`#${selector}`).removeClass('effect');
    }
  });

  $('#right-arrow').on('click', function() {
    // Go to next page
    pageIndex = (pageIndex + 1) % pages.length;
    redrawSelections();
  });

  $('#left-arrow').on('click', function() {
    // Go to previous page
    pageIndex = (pageIndex - 1 + pages.length) % pages.length;
    redrawSelections();
  });

  $('#text-input').on('input', function() {
    let currentEdit = pages[pageIndex];
    current[currentEdit] = $(this).val();
    $(`#${currentEdit}`).text(current[currentEdit]);
  });

  $('#add-new').on('click', function() {
    current = Object.assign({}, defaults);
    drawStrip();
  });

  $('#save-button').on('click', function() {
    const stripToCreate = {
      strip: {
        head: current.head,
        body: current.body,
        bubbleType: current.bubble,
        background: current.background,
        bubbleText: current.text,
        caption: current.caption
      }
    }

    $.ajax({
      type: 'POST',
      url: '/strips',
      data: JSON.stringify(stripToCreate),
      success: function(body) {
        addStrip(body.strip);
      },
      dataType: 'json',
      contentType: 'application/json',
    });
  });

  $('ul').on('click', '.strip-button', function() {
    let id = $(this).attr('id').split('-')[2];
    let strip = strips.find((strip) => strip.id === Number(id));
    current = strip;
    drawStrip();
  });
});
