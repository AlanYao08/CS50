document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = compose_submit;

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-content').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function compose_submit(event) {
  event.preventDefault()
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value,
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
    if(!result['error']) {
      load_mailbox('sent')
    }
  })
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-content').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails);
    emails.forEach(email_content => {
      const email = document.createElement('div');
      email.addEventListener('click', () => load_email(`${email_content['id']}`, `${mailbox}`));
      if(email_content['read']) {
        email.className = 'readEmail';
      }
      else {
        email.className = 'unreadEmail';
      }
      const email_name = document.createElement('span');
      email_name.className = 'nameEmail';
      email_name.innerHTML = `<b>${email_content['sender']}</b>&nbsp;&nbsp;&nbsp;&nbsp;${email_content['subject']}`;

      const email_time = document.createElement('span');
      email_time.className = 'timeEmail';
      email_time.innerHTML = `${email_content['timestamp']}`;

      email.append(email_name);
      email.append(email_time);
      document.querySelector('#emails-view').append(email);
    });
  });
}

function load_email(email_id, origin_mailbox) {
  document.querySelector('#emails-content').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    const view = document.createElement('div');
    const sender = document.createElement('div');
    sender.innerHTML = `<b>From: </b>${email['sender']}`;
    view.append(sender);
    const recipients = document.createElement('div');
    recipients.innerHTML = `<b>To: </b>${email['recipients']}`;
    view.append(recipients);
    const subject = document.createElement('div');
    subject.innerHTML = `<b>Subject: </b>${email['subject']}`;
    view.append(subject);
    const timestamp = document.createElement('div');
    timestamp.innerHTML = `<b>Timestamp: </b>${email['timestamp']}`;
    view.append(timestamp);
    const line = document.createElement('hr');
    view.append(line);
    const body = document.createElement('div');
    body.innerHTML = `${email['body']}`;
    view.append(body);
    document.querySelector('#emails-content').innerHTML = view.innerHTML;
    if(origin_mailbox !== "sent") {
      const archiveButton = document.createElement('button');
      archiveButton.className = "btn btn-sm btn-outline-primary";
      archiveButton.innerHTML = origin_mailbox === "inbox" ? "Archive" : "Unarchive";
      archiveButton.addEventListener('click', () => {
        fetch(`/emails/${email_id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: origin_mailbox === "inbox" ? true : false
          })
        })
        .then(response => load_mailbox('inbox'))
      });
      document.querySelector('#emails-content').append(archiveButton);
    }
    const replyButton = document.createElement('button');
    replyButton.className = "btn btn-sm btn-outline-primary";
    replyButton.innerHTML = "Reply";
    replyButton.addEventListener('click', () => {
      compose_email();
      if(email['subject'].slice(0, 4) != "Re: ") {
        email['subject'] = `Re: ${email['subject']}`;
      }
      document.querySelector('#compose-recipients').value = `${email['sender']}`;
      document.querySelector('#compose-subject').value = `${email['subject']}`;
      document.querySelector('#compose-body').value = `\nOn ${email['timestamp']} ${email['sender']} wrote:\n${email['body']}\n\n`;
    });
    document.querySelector('#emails-content').append(replyButton);
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    })
  });
}

