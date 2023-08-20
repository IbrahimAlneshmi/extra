const video = document.getElementById('camera');
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
    video.play();
});

// محاكاة قاعدة البيانات
const database = [
    { id: 1, text: 'نص 1', info: 'معلومات عن النص 1' },
    { id: 2, text: 'نص 2', info: 'معلومات عن النص 2' }
];

// معالجة البحث عند النقر على الزر
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');

searchButton.addEventListener('click', async () => {
    // التقاط صورة من الفيديو
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);

    // التعرف على النص باستخدام Tesseract.js
    const recognizedText = await recognizeText(canvas);
    console.log(تم التعرف على النص: ${recognizedText});

    // البحث في قاعدة البيانات باستخدام النص المعروف وعرض النتائج
    const results = searchInDatabase(recognizedText);
    displayResults(results);
});

const recognizeText = async (canvas) => {
    const { data: { text } } = await Tesseract.recognize(canvas, 'ara', {
        logger: progress => console.log(progress)
    });
    return text.trim();
};

const searchInDatabase = (text) => {
    return database.filter(item => item.text.includes(text));
};

const displayResults = (results) => {
    searchResults.innerHTML = '';
    if (results.length === 0) {
        searchResults.innerHTML = '<li توجد نتائج</li>';
    } else {
        results.forEach(result => {
            const li = document.createElement('li');
            li.textContent = ${result.text}: ${result.info};
            searchResults.appendChild(li);
        });
    }
};
