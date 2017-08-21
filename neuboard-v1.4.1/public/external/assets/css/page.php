<?php get_header(); ?>
		
		<div id="main">
			
			<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
			
			<div id="post-<?php the_ID(); ?>" <?php post_class('single'); ?>>
				
				<?php if(!vp_metabox('manna_page.page_title') == 1) : ?>
				<div class="post-heading">
					
					<h2><?php the_title(); ?></h2>
					
				</div>
				<?php endif; ?>
				
				<?php if(!vp_metabox('manna_page.page_featured_img') == 1) : ?>
				<div class="post-img">
					<?php if ( (function_exists('has_post_thumbnail')) && (has_post_thumbnail()) ) : ?>
						<?php cassia_the_featured_image(); ?>
					<?php endif; ?>
				</div>
				<?php endif ?>
				
				<div class="post-entry">
					<?php the_content(); ?>
				</div>
				
				<?php if(!vp_metabox('manna_page.page_share') == 1) : ?>
				<div class="post-share">
					<div class="share-buttons">
						<?php get_template_part('inc/templates/social_share_buttons'); ?>
					</div>
				</div>
				<?php endif; ?>
				
			</div>
			
			<?php endwhile; ?>
			<?php endif; ?>
		
		</div>
	

<?php get_sidebar(); ?>
<?php get_footer(); ?>