
const basicSearchInput = document.getElementById("basicSearchInput");
const basicSearchButton = document.getElementById("basicsearchbutton");
const search_button = document.getElementById("searchButton")
const result_placeholder = document.getElementById("results-placeholder")
const results_area = document.getElementById("search-results")
const chat_button = document.getElementById("chatButton");
const chatInput = document.getElementById("chatInput");
const messagesDiv = document.getElementById("messages");


basicSearchButton.addEventListener('click', function() {
	basicSearchInput.focus();
});

search_button.addEventListener('click', function() {
	const escapedQuery = basicSearchInput.value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	axios.post('http://127.0.0.1:6001/chat',  params = { qtype: 0, query: basicSearchInput.value }) // POST query data to backend
        .then(response => {
			result_placeholder.style.visibility = "hidden"
			let contentString = '';
			var data = response.data
			console.log(data)
			data.forEach(item => {
				contentString += `<div class="ui segment">`; // Using Semantic UI segment to group related content.
				contentString += `<p class="ml-10 mr-10 text-gray-800"><strong>Source:</strong>`;
			
				// Add the source link conversion logic here.
				const match = item.document.metadata.source.match(/FI(\d+)_([^_]+)(?:_(\d+))?\.pdf$/);
				if (match) {
					const bibid = match[1];
					const vid = match[2];
					const url = `http://dpanther.fiu.edu/dpanther/items/itemdetail?bibid=FI${bibid}&vid=${vid}`;
					contentString += `<a class="ui link" href="${url}" target="_blank">${url}</a>`; // Applying Semantic UI link class to anchor tags.
				} else {
					contentString += `${item.document.metadata.source}`;
				}
				
				contentString += `</p>`;
				
				// Highlight the search input value in the page content with bold and deep red color.
				const cleanedContent = item.document.page_content.replace(/\n/g, ' ').replace(new RegExp(escapedQuery, 'gi'), match => `<strong class="highlight" style="color: #8B0000;">${match}</strong>`);
				contentString += `<p class="ml-10 mr-10 text-gray-800"><strong>Page Content:</strong> ${cleanedContent}</p>`;
				contentString += `</div>`; // End of Semantic UI segment.
			});
			
			
			console.log(contentString);
			results_area.innerHTML = contentString;
			results_area.style.color = 'black'; // or any color you prefer
			results_area.style.textAlign = 'left';

		});
	// basicSearchInput.focus();
});


// chat_button.addEventListener('click', function() {
// 	const escapedQuery = chatInput.value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
// 	axios.post('http://127.0.0.1:6001/chat',  params = { qtype: 1, query: chatInput.value }) // POST query data to backend
//         .then(response => {
// 			console.log(response.data[response.data.length-1].answer)

// 		});

// });

chat_button.addEventListener('click', function() {
	const userQuery = chatInput.value;

	// Append user's query to chat window
	const userMessageDiv = createChatMessageDiv(userQuery, true);
	messagesDiv.appendChild(userMessageDiv);

	axios.post('http://127.0.0.1:6001/chat', { qtype: 1, query: userQuery }) // POST query data to backend
        .then(response => {
			const answer = response.data[response.data.length - 1].answer;
			let sourceUrl;
			if (response.data.length >= 2 && response.data[0].document && response.data[0].document.metadata) {
				const source = response.data[0].document.metadata.source;
				const match = source.match(/FI(\d+)_([^_]+)(?:_(\d+))?\.pdf$/);
				if (match) {
					const bibid = match[1];
					const vid = match[2];
					sourceUrl = `http://dpanther.fiu.edu/dpanther/items/itemdetail?bibid=FI${bibid}&vid=${vid}`;
				} else {
					sourceUrl = `Source: ${source}`;
				}
				const responseMessageDiv = createChatMessageDiv(answer, false, sourceUrl);
				messagesDiv.appendChild(responseMessageDiv);
			} else {
				sourceUrl = 'Source: Answer from the global model';
			const responseMessageDiv = createLLMChatMessageDiv(answer, false, sourceUrl);
			messagesDiv.appendChild(responseMessageDiv);
			}

			// Append response to chat window with Source URL
			

			// Scroll to the bottom of messages div
			messagesDiv.scrollTop = messagesDiv.scrollHeight;
		});
});

// Modify this function to accept sourceUrl and append it to the messageText
function createChatMessageDiv(messageText, isUser, sourceUrl) {
	const chatMessageDiv = document.createElement('div');
	chatMessageDiv.className = 'chat-message';

	const flexDiv = document.createElement('div');
	flexDiv.className = 'flex items-end ' + (isUser ? 'justify-end' : '');

	const flexColDiv = document.createElement('div');
	flexColDiv.className = 'flex flex-col space-y-2 text-sm max-w-xs mx-2 order-' + (isUser ? '1' : '2') + ' items-' + (isUser ? 'end' : 'start');

	const messageDiv = document.createElement('div');
	const span = document.createElement('span');
	span.className = 'px-4 py-2 rounded-lg inline-block ' + (isUser ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600');
	span.innerHTML = isUser ? messageText : `${messageText} <a href="${sourceUrl}" target="_blank">Source</a>`;
	messageDiv.appendChild(span);
	flexColDiv.appendChild(messageDiv);

	const img = document.createElement('img');
	img.className = 'w-6 h-6 rounded-full order-' + (isUser ? '2' : '1');
	img.src = isUser ? 'https://images.emojiterra.com/google/noto-emoji/unicode-15/color/svg/1f643.svg' : 'https://images.emojiterra.com/google/noto-emoji/unicode-15/color/svg/1f916.svg';

	flexDiv.appendChild(flexColDiv);
	flexDiv.appendChild(img);

	chatMessageDiv.appendChild(flexDiv);

	return chatMessageDiv;
}

function createLLMChatMessageDiv(messageText, isUser, sourceUrl) {
	const chatMessageDiv = document.createElement('div');
	chatMessageDiv.className = 'chat-message';

	const flexDiv = document.createElement('div');
	flexDiv.className = 'flex items-end ' + (isUser ? 'justify-end' : '');

	const flexColDiv = document.createElement('div');
	flexColDiv.className = 'flex flex-col space-y-2 text-sm max-w-xs mx-2 order-' + (isUser ? '1' : '2') + ' items-' + (isUser ? 'end' : 'start');

	const messageDiv = document.createElement('div');
	const span = document.createElement('span');
	span.className = 'px-4 py-2 rounded-lg inline-block ' + (isUser ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600');
	span.innerHTML = isUser ? messageText : `${messageText} <a href="${sourceUrl}" target="_blank">${sourceUrl}</a>`;
	messageDiv.appendChild(span);
	flexColDiv.appendChild(messageDiv);

	const img = document.createElement('img');
	img.className = 'w-6 h-6 rounded-full order-' + (isUser ? '2' : '1');
	img.src = isUser ? 'https://images.emojiterra.com/google/noto-emoji/unicode-15/color/svg/1f643.svg' : 'https://images.emojiterra.com/google/noto-emoji/unicode-15/color/svg/1f916.svg';

	flexDiv.appendChild(flexColDiv);
	flexDiv.appendChild(img);

	chatMessageDiv.appendChild(flexDiv);

	return chatMessageDiv;
}