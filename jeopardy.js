// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
let QA = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const res = await axios.get('http://jservice.io/api/categories', {
        params: {
            count: 100
        }
    });
    let result = res.data.map(x => x.id);
  //  console.log(result);
    return result;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const res = await axios.get('http://jservice.io/api/clues', {
        params: {
            category: catId
        }
    })
//    console.log(res.data[0].category.title);
    let clueArray = res.data.map(x => ({
        question: x.question,
        answer: x.answer

    }))
    let result = {title: res.data[0].category.title, clues: clueArray};
    return result;
   // console.log(result);
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    const myTable = document.querySelector("#myTable");
    let catRandom = []
    for (let x =0; x < 6; x++) {
        catRandom.push(Math.floor(Math.random()*100));
    }
    categories = await getCategoryIds();
    const tHead = document.createElement('thead');
    const tr = document.createElement('tr');
    QA = [
        await getCategory( categories[catRandom[0]]),
        await getCategory( categories[catRandom[1]]),
        await getCategory( categories[catRandom[2]]),
        await getCategory( categories[catRandom[3]]),
        await getCategory( categories[catRandom[4]]),
        await getCategory( categories[catRandom[5]]),
    ];
    const tbody = document.createElement('tbody');
    for (let i =0; i < 6; i++) {
        const th = document.createElement('th');
        th.innerText = QA[i].title;
        tr.appendChild(th);       
    }
    hideLoadingView();
    myTable.appendChild(tHead);
    myTable.appendChild(tr);
    helperTable(myTable);
}

function helperTable(myTable) {
    for (let i =0; i < 5; i++) {
        const tr2 = document.createElement('tr');
        for (let j=0; j<6; j++) {
            const td = document.createElement('td');
            const span = document.createElement('span');
            span.className = "glyphicon glyphicon-question-sign";
            td.appendChild(span);
            td.colspan = j;
            td.rowspan = i;
            td.addEventListener("click", function(e) {
                handleClick(e);
            });
            tr2.appendChild(td);
            myTable.appendChild(tr2);
        } 
    }
}
/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    if (evt.target.tagName === "TD" && evt.target.className !== "clicked") { 
        evt.target.className = "clicked";
        let a = evt.target.rowspan;
        let b = evt.target.colspan;
        evt.target.innerHTML = "";
        evt.target.innerText = QA[b].clues[a].question;
    }  else if (evt.target.tagName === "TD" && evt.target.className === "clicked" ) {
        let a = evt.target.rowspan;
        let b = evt.target.colspan;
        evt.target.innerText = QA[b].clues[a].answer;
    } else {
        evt.target.parentElement.className = "clicked";
        let a = evt.target.parentElement.rowspan;
        let b = evt.target.parentElement.colspan;
        evt.target.parentElement.innerText = QA[b].clues[a].question;
    }
    
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    $('#mySpinner').show();
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    $('#mySpinner').hide();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    showLoadingView();
    fillTable();
}
const btn = document.querySelector("button");
btn.addEventListener("click", function(e) {
    if (e.target.innerText === "Start") {
        e.preventDefault();
        setupAndStart();
        e.target.innerText = "Restart";
    } else {
        $('table').empty();
        setupAndStart();
    }
    
})
/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO