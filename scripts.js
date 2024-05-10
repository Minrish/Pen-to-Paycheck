function toggleModal(section) {
    const modal = document.getElementById('tagModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    modal.dataset.section = section;
}

function addTag() {
    const tagInput = document.getElementById('newTag').value;
    const section = document.getElementById('tagModal').dataset.section;
    if (tagInput.trim() === "") return;

    const newTag = document.createElement('span');
    newTag.textContent = tagInput;
    newTag.classList.add('tag');
    newTag.style.background = section === 'writing' ? 'linear-gradient(to right, #8e9eab, #eef2f3)' : 'linear-gradient(to right, #ffecd2, #fcb69f)';
    newTag.onclick = function() { updateTags(newTag); };

    const container = document.querySelector(`.${section}-tags .tag-container`);
    container.appendChild(newTag);
    document.getElementById('newTag').value = '';
    toggleModal();
}
function createNewTag() {
    const input = document.getElementById('newTagInput').value;
    if (!input.trim()) return;

    const newTag = document.createElement('span');
    newTag.textContent = input;
    newTag.className = 'tag new-tag';
    newTag.style.background = document.getElementById('tagModal').dataset.section === 'writing' ? 'linear-gradient(to right, #8e9eab, #eef2f3)' : 'linear-gradient(to right, #ffecd2, #fcb69f)';

    // Attach event listener for updating the preview
    newTag.addEventListener('click', function() {
        updateTags(newTag);
    });

    document.querySelector('.tag-container').appendChild(newTag);
    document.getElementById('newTagInput').value = '';
    toggleModal();
}

// This function toggles tags in the preview when clicked
function updateTags(tag) {
    const previewTags = document.getElementById('previewTags');
    let existing = Array.from(previewTags.children).some(child => child.textContent === tag.textContent);
    if (existing) {
        Array.from(previewTags.children).forEach(child => {
            if (child.textContent === tag.textContent) previewTags.removeChild(child);
        });
    } else {
        const tagClone = tag.cloneNode(true);
        tagClone.onclick = function() { updateTags(tagClone); }; // Allow deselecting by re-clicking in the preview
        previewTags.appendChild(tagClone);
    }
}

function updatePreview() {
    const title = document.getElementById('workTitle').value;
    const content = document.getElementById('content').value;
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewContent').textContent = content;
}

function addFeedbackPrompt() {
    const feedbackPrompt = document.getElementById('feedbackRequest').value;
    document.getElementById('previewFeedbackPrompt').textContent = feedbackPrompt;
}

// Function to handle deletion with confirmation
function deleteWriting(element) {
    if (confirm('Are you sure you want to delete this writing?')) {
        element.parentNode.removeChild(element);
    }
}

/////////////////////////////////////////////// FEEDBACK MECHANISM ///////////////////////////////////////////////
let activeUserColor = 'red'; // Default to the first user's color

function setActiveUserColor(color) {
    activeUserColor = color;
}

function triggerCommentBox(element) {
    const text = element.textContent;
    const rect = element.getBoundingClientRect();

    showCommentBox(rect.bottom + window.scrollY, rect.left, text);
}

function addComment() {
    const commentBox = document.getElementById('commentBox');
    const commentText = document.getElementById('commentInput').value;
    const lineText = document.getElementById('commentText').value;
    if (!commentText.trim()) return;

    const comment = document.createElement('div');
    comment.className = 'comment';
    comment.textContent = commentText + " (on line: '" + lineText + "')";
    comment.style.borderLeft = `4px solid ${activeUserColor}`;

    document.getElementById('commentsDisplay').appendChild(comment);
    commentBox.style.display = 'none'; // Hide the comment box after adding
}

function showCommentBox(top, left, text) {
    const commentBox = document.getElementById('commentBox') || createCommentBox();
    commentBox.style.top = top + 'px';
    commentBox.style.left = left + 'px';
    document.getElementById('commentText').value = text;
    document.getElementById('commentInput').value = '';
    commentBox.style.display = 'block';
}

function createCommentBox() {
    const commentBox = document.createElement('div');
    commentBox.id = 'commentBox';
    commentBox.className = 'comment-box';
    commentBox.style.position = 'absolute';
    commentBox.innerHTML = `
        <input type="hidden" id="commentText">
        <textarea id='commentInput' rows='4' placeholder='Enter your comment'></textarea>
        <button onclick='addComment()'>Add Comment</button>
    `;
    document.body.appendChild(commentBox);
    return commentBox;
}