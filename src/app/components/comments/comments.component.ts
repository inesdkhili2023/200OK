import { Component } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent {
  comments = [
    { name: 'Sobly Kelly', date: '8 Feb 2018', text: 'Consectetur adipiscing elit...', image: 'images/agent4.jpg' },
    { name: 'Jason Grek', date: '10 Feb 2018', text: 'Integer feugiat dolor...', image: 'images/agent3.jpg' },
    { name: 'Cliff Hrowl', date: '8 Feb 2018', text: 'Cum sociis natoque...', image: 'images/agent1.jpg' },
  ];

  onReply(comment: any) {
    console.log('Reply to:', comment.name);}

}
