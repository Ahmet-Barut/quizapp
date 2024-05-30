document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const questionContainer = document.getElementById('question-container');
    const questionText = document.getElementById('question-text');
    const choicesContainer = document.getElementById('choices');
    const nextButton = document.getElementById('next-button');
    const resultsContainer = document.getElementById('results');

    let questions = [];
    let currentQuestionIndex = 0;
    let answers = [];
    let timer;

    const fetchQuestions = async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        questions = data.slice(0, 10).map((item, index) => {
            return {
                id: item.id,
                question: item.title,
                choices: generateChoices(item.body),
                correctAnswer: 'D' 
            };
        });
        showQuestion();
    };

    const generateChoices = (text) => {
        const words = text.split(' ').slice(0, 4); 
        return words.map((word, index) => {
            return {
                choice: String.fromCharCode(65 + index), 
                text: word
            };
        });
    };

    const showQuestion = () => {
        if (currentQuestionIndex >= questions.length) {
            showResults();
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        choicesContainer.innerHTML = '';
        currentQuestion.choices.forEach(choice => {
            const li = document.createElement('li');
            li.textContent = `${choice.choice}: ${choice.text}`;
            li.dataset.choice = choice.choice;
            li.classList.add('disabled');
            li.addEventListener('click', selectAnswer);
            choicesContainer.appendChild(li);
        });

        questionContainer.classList.remove('hidden');
        nextButton.classList.add('hidden');

        timer = setTimeout(enableChoices, 10000); 
        setTimeout(showNextButton, 30000); 
    };

    const enableChoices = () => {
        const choices = choicesContainer.querySelectorAll('li');
        choices.forEach(choice => choice.classList.remove('disabled'));
    };

    const showNextButton = () => {
        nextButton.classList.remove('hidden');
    };

    const selectAnswer = (event) => {
        const selectedChoice = event.target.dataset.choice;
        const currentQuestion = questions[currentQuestionIndex];
        
      
        const choices = choicesContainer.querySelectorAll('li');
        choices.forEach(choice => choice.classList.remove('selected'));

  
        event.target.classList.add('selected');

        answers.push({
            question: currentQuestion.question,
            selectedAnswer: selectedChoice,
            correctAnswer: currentQuestion.correctAnswer
        });

        clearTimeout(timer);
        nextButton.classList.remove('hidden');
    };

    const showResults = () => {
        questionContainer.classList.add('hidden');
        nextButton.classList.add('hidden');
        resultsContainer.innerHTML = '<h2>Results</h2>';
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
            </tr>
        `;
        answers.forEach(answer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${answer.question}</td>
                <td>${answer.selectedAnswer}</td>
                <td>${answer.correctAnswer}</td>
            `;
            table.appendChild(row);
        });
        resultsContainer.appendChild(table);
        resultsContainer.classList.remove('hidden');
    };

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        showQuestion();
    });

    fetchQuestions();
});
