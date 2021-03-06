import {Component, View, Inject, Input} from 'angular2/core';
import {IPost} from '../services/PostsService';
import {MediaService, IMedia} from '../services/MediaService';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'post-list-item',
    providers: [MediaService]
})
@View({
    directives: [ROUTER_DIRECTIVES],
    template: `
        <h2><a [routerLink]="['SinglePost', {postID : postItem.id}]">{{ postItem.title.rendered }}</a></h2>
        <em class="post-item__date text-muted">{{ postItem.date }}</em>
        <div class="post-item-excerpt clearfix">
            <div class="thumbnail
                        post-item-excerpt__thumbnail"
                 [ngClass]="{'post-item-excerpt__thumbnail_show': media}"
                 *ngIf="postItem.featured_media > 0">
                <img *ngIf="media" src="{{ media.media_details.sizes.thumbnail.source_url }}">
            </div>
            <div class="post-item-excerpt__text"
                 [innerHTML]="postItem.excerpt.rendered"></div>
        </div>
    `
})
export class PostListItem {
    @Input('post-item') postItem: IPost;

    media: IMedia;
    private mediaSubscription;

    constructor(@Inject(MediaService) private MediaService) {
        this.mediaSubscription = MediaService.media.subscribe(newMedia => {
            this.media = newMedia
        });
    }

    ngOnInit() {
        if (this.postItem.featured_media > 0) {
            this.MediaService.getMedia(this.postItem.featured_media);
        }
    }

    ngOnDestroy() {
        this.mediaSubscription.unsubscribe();
    }
}
