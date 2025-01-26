const htmlEditor = document.getElementById('htmlEditor');
        const cssEditor = document.getElementById('cssEditor');
        const jsEditor = document.getElementById('jsEditor');
        const preview = document.getElementById('preview');
        const fullPagePreview = document.getElementById('preview-fullpage')
        const modeSelect = document.getElementById('modeSelect');
        const consoleOutput = document.getElementById('console-output');
        const editorContainer = document.querySelector('.editor-container');
        const fullPageView = document.getElementById('full-page-view')
        const userManualPopup = document.getElementById('user-manual-popup')
        const userManualIcon = document.getElementById('user-manual-icon');
        const codeAssistantInput = document.getElementById('code-assistant-input');
        const chatModal = document.getElementById('chat-modal');
        const chatMessages = document.getElementById('chat-messages');
        const thinkingElement = document.querySelector('#chat-modal .thinking');
        const headerButtons = document.getElementById('header-buttons');
        const codeToggleButton = document.getElementById('code-toggle-button');
        const previewFullscreenButton = document.getElementById('preview-fullscreen-button');
        const notificationContainer = document.getElementById('notification-container');
        const minimizeButton = document.getElementById('minimize-button')
        const minimizedContainer = document.getElementById('minimized-code-container')
        const loadingScreen = document.getElementById('loading-screen');
        const loadingBar = document.getElementById('loading-bar');
        const mainContainer = document.querySelector('.container')



        let mode = "html";
        let currentView = "editor";
        let isFullPageViewActive = false;
        let isPreviewFullscreen = false;
        let apiKey = "AIzaSyB3vFjH7IsfekpbEuhWG2uKapRW1HcAxp4"
        let isMinimized = false;
        let minimizedItems = [];


        function initLoadingScreen() {
            const duration = Math.random() * 5000 + 1000; // 1 to 6 seconds
            let progress = 0
            const interval = setInterval(() => {
                progress += 100 / (duration / 100)
                loadingBar.style.width = progress + '%'
                if (progress >= 100) {
                    clearInterval(interval);
                    hideLoadingScreen();
                }
            }, 100)

        }

        function hideLoadingScreen() {
            loadingScreen.classList.add('hidden')
            setTimeout(() => {
                mainContainer.style.display = 'block'

            }, 500);
        }

        function toggleUserManual() {
            userManualPopup.classList.toggle('active')
        }

        function toggleFullPageView() {
            isFullPageViewActive = !isFullPageViewActive;
             if (isFullPageViewActive) {
                fullPageView.classList.add('active');
                updateFullPagePreview()
              }
              else {
                 fullPageView.classList.remove('active');
             }

        }

        function toggleMinimize() {
            minimizedContainer.classList.toggle('active');
        }

        function resetAll() {
            resetEditors();
            resetChat();
            showNotification('Reset Complete!');
        }

        function sendFeedback() {
            window.location.href = 'mailto:flynnpontino@gmail.com?subject=Codefusion Feedback';
        }

        function minimizeCode() {
            isMinimized = !isMinimized
            if (isMinimized) {
                minimizedContainer.classList.add('active');
                let htmlContent = htmlEditor.value;
                let cssContent = cssEditor.value;
                let jsContent = jsEditor.value
                let previewFunction = `<div class="minimized-item" onclick="restoreCode('html')"><i class="fab fa-html5"></i> Restore HTML </div>let cssFunction =<div class="minimized-item" onclick="restoreCode('css')"><i class="fab fa-css3-alt"></i> Restore CSS</div>let jsFunction =<div class="minimized-item" onclick="restoreCode('js')"><i class="fab fa-js"></i> Restore JS</div>`

minimizedContainer.innerHTML = `<span class="close-minimize" onclick="toggleMinimize()">×</span>` + (htmlContent ? previewFunction : '') + (cssContent ? cssFunction : '') + (jsContent ? jsFunction : '');


        }
        else {
            minimizedContainer.classList.remove('active');
        }
    }


    function restoreCode(type) {
        if (type === 'html') {
            htmlEditor.value = htmlEditor.value;
        }
        if (type === 'css') {
            cssEditor.value = cssEditor.value
        }
        if (type === 'js') {
            jsEditor.value = jsEditor.value
        }
        toggleMinimize()
    }

   function toggleEditorsVisibility() {
        editorContainer.classList.toggle('hidden');
           if (editorContainer.classList.contains('hidden')) {
              codeToggleButton.innerHTML = `<i class="fas fa-code"></i>`
             } else {
               codeToggleButton.innerHTML = `<i class="fas fa-code"></i>`
           }
        }


    function updateFullPagePreview() {
        const htmlCode = htmlEditor.value;
        const cssCode = cssEditor.value;
        const jsCode = jsEditor.value;

        const iframeDoc = fullPagePreview.contentDocument || fullPagePreview.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(htmlCode);
        iframeDoc.close();

        const style = iframeDoc.createElement('style');
        style.innerHTML = cssCode;
        iframeDoc.head.appendChild(style);

        const script = iframeDoc.createElement('script');
        script.innerHTML = jsCode;
        iframeDoc.body.appendChild(script);

    }

     function togglePreviewFullscreen() {
        isPreviewFullscreen = !isPreviewFullscreen;
        preview.classList.toggle('fullscreen-preview', isPreviewFullscreen);
           previewFullscreenButton.innerHTML = isPreviewFullscreen ? `<i class="fas fa-compress"></i>` : `<i class="fas fa-expand"></i>`;

      if(isPreviewFullscreen) {
        const closeButton = document.createElement('span')
          closeButton.classList.add('close-full-preview')
            closeButton.innerHTML = "×"
            closeButton.onclick = () => togglePreviewFullscreen();
        preview.appendChild(closeButton)
      } else {
       const closeButton = preview.querySelector('.close-full-preview')
        if(closeButton){
             preview.removeChild(closeButton);
          }
     }
    }
    function updatePreview() {
        const htmlCode = htmlEditor.value;
        const cssCode = cssEditor.value;
        const jsCode = jsEditor.value;
        const iframeDoc = preview.contentDocument || preview.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(htmlCode);
        iframeDoc.close();

        const style = iframeDoc.createElement('style');
        style.innerHTML = cssCode;
        iframeDoc.head.appendChild(style);

        const script = iframeDoc.createElement('script');
        script.innerHTML = jsCode;
        iframeDoc.body.appendChild(script);
        consoleOutput.innerHTML = `Successfully updated preview`;
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('vanish')
            notification.addEventListener('transitionend', () => {
                notificationContainer.removeChild(notification);
            });
        }, 1500);
    }

    function addMessage(content, isUser, isBotCode = false) {
        const message = document.createElement('div');
        message.classList.add('message', isUser ? 'user-message' : 'bot-message');
        if (isUser) {
            message.innerHTML = `
           ${content}
              <div class="actions">
                <button onclick="editUserMessage(this)"><i class="fas fa-edit"></i></button>
             </div>`;

        } else {

            let messageContent = content;
            let codeSnippet = null;
            const codeMatch = messageContent.match(/```([\w-]+)?\s*([\s\S]*?)```/);

            if (codeMatch) {
                codeSnippet = `<pre><code class="language-${codeMatch[1] || 'plaintext'}">${codeMatch[2].trim()}</code></pre>`
                messageContent = messageContent.replace(codeMatch[0], "").trim()
            }

            message.innerHTML = `
           ${messageContent}
          ${codeSnippet || ""}
              <div class="actions">
                 <button onclick="copyBotMessage(this)"><i class="fas fa-copy"></i></button>
             </div>`;
        }
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function editUserMessage(button) {
        const messageElement = button.closest('.message');
        const initialText = messageElement.firstChild.textContent
        const textarea = document.createElement('textarea');
        textarea.value = initialText;
        textarea.style.width = '100%';
        textarea.style.minHeight = '100px';
        textarea.style.boxSizing = 'border-box';
        textarea.style.color = '#ecf0f1';
        textarea.style.background = 'rgba(0, 0, 0, 0.3)';
        textarea.style.padding = '10px'
        textarea.style.borderRadius = '5px'
        textarea.style.margin = '5px 0'
        textarea.style.resize = 'vertical';

        const saveButton = document.createElement('button');
        saveButton.innerText = "Save";
        saveButton.style.background = '#3498db';
        saveButton.style.color = '#ecf0f1';
        saveButton.style.padding = '8px 12px';
        saveButton.style.borderRadius = '5px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.border = 'none'
        saveButton.style.marginTop = '5px'
        saveButton.style.transition = 'background 0.3s ease';
        saveButton.style.display = 'inline-block'

        saveButton.addEventListener('mouseover', function () {
            saveButton.style.background = '#2980b9';
        });
        saveButton.addEventListener('mouseout', function () {
            saveButton.style.background = '#3498db';
        });


        messageElement.innerHTML = '';
        messageElement.appendChild(textarea);
        messageElement.appendChild(saveButton);

        saveButton.addEventListener('click', function () {
            const updatedContent = textarea.value;
            messageElement.innerHTML =
                `${updatedContent}
              <div class="actions">
                <button onclick="editUserMessage(this)"><i class="fas fa-edit"></i></button>
             </div>`;
        });
    }


    function copyBotMessage(button) {
        const messageElement = button.closest('.message');
        const codeBlock = messageElement.querySelector('pre code');
        const textContent = messageElement.firstChild.textContent;

        const code = codeBlock ? codeBlock.textContent : null;
        const combined = code ? textContent + "\n" + code : textContent
        navigator.clipboard.writeText(combined).then(() => {
            alert("Copied to clipboard!");
        }).catch(err => console.error("Error copying:", err));
    }

    function segregateCode() {
        const code = htmlEditor.value;
        if (!code) return consoleOutput.innerHTML = `No HTML code detected.`;

        let segregatedHTML = "";
        let segregatedCSS = "";
        let segregatedJS = "";

        // Extract HTML outside script and style tags
        segregatedHTML = code.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').trim();

        // Extract JavaScript inside script tags
        const scriptMatches = code.matchAll(/<script>([\s\S]*?)<\/script>/gi);
        for (const match of scriptMatches) {
            segregatedJS += match[1].trim() + '\n';
        }

        // Extract CSS inside style tags
        const styleMatches = code.matchAll(/<style>([\s\S]*?)<\/style>/gi);
        for (const match of styleMatches) {
            segregatedCSS += match[1].trim() + '\n';
        }
        htmlEditor.value = segregatedHTML.trim();
        cssEditor.value = segregatedCSS.trim();
        jsEditor.value = segregatedJS.trim();
        consoleOutput.innerHTML = `HTML, CSS, and JS code segregated.`;
        updatePreview();

    }

    async function sendCodeQuery() {
        const query = codeAssistantInput.value.trim();
        if (!query) return alert('Please enter your query');
        thinkingElement.style.display = "flex";
        codeAssistantInput.disabled = true;
        addMessage(query, true)
        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `CodyPro v6 (GPT Developer Edition) is your steadfast pair programmer, armed with enhanced code generation ability, online access for the latest APIs, and custom commands to save your session state so you can recall it in a new session later. /help will tell you all about it. Say "Hello" to start! ${query} Only give code related output to the query that is related to HTML, do not provide full documents.  If the user did not ask for specific language, output the code with the html or plaintext code language.`
                        }]
                    }]
                })
            });
            if (!response.ok) {
                console.error(`API request failed with status ${response.status}`);
                const errorData = await response.json();
                console.error("API error details:", errorData);
                addMessage(`Error: Could not get response from Cody AI`, false)
                thinkingElement.style.display = "none";
                codeAssistantInput.disabled = false;
                return;
            }
            const data = await response.json();
            thinkingElement.style.display = "none";
            codeAssistantInput.disabled = false;
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
                let responseText = data.candidates[0].content.parts[0].text.trim();
                addMessage(responseText, false);
                htmlEditor.value += "\n" + responseText;
                updatePreview();
            } else {
                console.error("No response text found in data:", data);
                addMessage(`Error: No response from Cody AI`, false)
            }

        } catch (error) {
            console.error("Error during API request:", error);
            addMessage(`Error: ${error}`, false)
            thinkingElement.style.display = "none";
            codeAssistantInput.disabled = false;
        }
        codeAssistantInput.value = '';
    }


    function toggleChatModal() {
        chatModal.classList.toggle('active');
    }

    function resetChat() {
        chatMessages.innerHTML = '';
        showNotification('Chat history cleared.');
    }

   function toggleEditors() {
        const editorContainer = document.querySelector('.editor-container');
          editorContainer.style.display = editorContainer.style.display === 'none' ? 'flex' : 'none';
    }

    function copyCode(type) {
        let code;
        if (type === 'html') {
            code = htmlEditor.value;
        } else if (type === 'css') {
            code = cssEditor.value;
        } else {
            code = jsEditor.value;
        }

        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        alert(`${type.toUpperCase()} code copied!`);
    }

    function resetEditors() {
        htmlEditor.value = '';
        cssEditor.value = '';
        jsEditor.value = '';
        consoleOutput.innerHTML = `Editor reset.`
        updatePreview();
    }

    modeSelect.addEventListener('change', function () {
        const selectedMode = modeSelect.value;
        htmlEditor.style.display = selectedMode === 'html' ? 'block' : 'none';
        cssEditor.style.display = selectedMode === 'css' ? 'block' : 'none';
        jsEditor.style.display = selectedMode === 'js' ? 'block' : 'none';
        mode = selectedMode;
        consoleOutput.innerHTML = `Mode set to ${mode}`
    });

    htmlEditor.addEventListener('input', updatePreview);
    cssEditor.addEventListener('input', updatePreview);
    jsEditor.addEventListener('input', updatePreview);

    codeAssistantInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendCodeQuery();
        }
    });
    initLoadingScreen();
    updatePreview();
