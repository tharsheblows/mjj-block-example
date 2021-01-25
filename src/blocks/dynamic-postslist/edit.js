/**
 * External dependencies
 */
import { isUndefined, pickBy, map } from 'lodash';
import classnames from 'classnames';
import moment from 'moment';

/**
 * Internal dependencies
 */
import Inspector from './inspector';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { Fragment, Component } from '@wordpress/element';
import {
	Placeholder,
	Spinner,
	withSpokenMessages,
} from '@wordpress/components';

/**
 * Block edit function
 */
class Edit extends Component {
	componentDidMount() {
		const { setAttributes } = this.props;

		setAttributes( { paged: 1 } );
	}

	render() {
		const { isSelected, postsList, className } = this.props;

		const truncate = ( str, noWords ) => {
			return str.split( ' ' ).splice( 0, noWords ).join( ' ' );
		};

		// Check if there are posts
		const hasPosts = Array.isArray( postsList ) && postsList.length;

		//placeholder when there are no posts or still loading
		if ( ! hasPosts ) {
			return (
				<Fragment>
					<Placeholder
						icon="excerpt-view"
						label={ __( 'Posts List Block', 'porchy' ) }
					>
						{ ! Array.isArray( postsList ) ? (
							<Spinner />
						) : (
							__( 'No posts found.', 'porchy' )
						) }
					</Placeholder>
				</Fragment>
			);
		}

		return (
			<Fragment>
				{ isSelected && <Inspector { ...this.props } /> }
				<section
					className={ classnames( className, 'postslist-block' ) }
				>
					{ map( postsList, ( post, i ) => {
						return (
							<article
								key={ i }
								id={ 'post-' + post.id }
								className={ classnames(
									'hentry',
									'post-' + post.id,
									post.type,
									'type-' + post.type,
									'status-' + post.status,
									'format-' + post.format,
									post.featured_media
										? 'has-post-thumbnail'
										: null
								) }
							>
								<header className="entry-header">
									<h2>
										<a
											href={ post.link }
											target="_blank"
											rel="noopener noreferrer"
										>
											{ decodeEntities(
												post.title.rendered.trim()
											) ||
												__(
													'(Untitled)',
													'porchy'
												) }
										</a>
									</h2>
									<div className="entry-meta">
										<span className="post-author">
											<a
												target="_blank"
												rel="noopener noreferrer"
												href={
													post.author_info.author_link
												}
											>
												{
													post.author_info
														.display_name
												}
											</a>
										</span>
										<span className="posted-on">
											<a
												href={ post.link }
												target="_blank"
												rel="noopener noreferrer"
											>
												<time
													className="entry-date published"
													dateTime={ moment(
														post.date_gmt
													)
														.utc()
														.format() }
												>
													{ moment( post.date_gmt )
														.local()
														.format(
															'MMMM DD, Y',
															'postslist-block'
														) }
												</time>
											</a>
										</span>
									</div>
								</header>
								{ post.featured_media ? (
									<div className="entry-media">
										<a
											href={ post.link }
											className="post-thumbnail"
											target="_blank"
											rel="noopener noreferrer"
										>
											<figure>
												<img
													src={
														post.featured_image_src_full
													}
													alt=""
												/>
											</figure>
										</a>
									</div>
								) : null }
								<div className="entry-summary">
									<div
										dangerouslySetInnerHTML={ {
											__html: truncate(
												post.excerpt.rendered,
												55
											),
										} }
									/>
								</div>
							</article>
						);
					} ) }
				</section>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { postsToShow } = props.attributes;

		const { getEntityRecords } = select( 'core' );

		const postsListQuery = pickBy(
			{
				per_page: postsToShow,
				exclude: [ select( 'core/editor' ).getCurrentPostId() ],
			},
			( value ) => ! isUndefined( value )
		);

		return {
			postsList: getEntityRecords( 'postType', 'post', postsListQuery ),
		};
	} ),
	withSpokenMessages,
] )( Edit );
