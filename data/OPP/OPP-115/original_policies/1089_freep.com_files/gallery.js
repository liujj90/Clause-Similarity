define(["jquery","underscore","backbone","baseview","pubsub","utils","state","modules/global/taboola","meteredAdPosition","directAdPosition","adLogger","cookie"],function(e,t,i,s,a,o,n,l,r,d,h){var u=s.extend({events:{"click .gallery-actions-replay, .gallery-photo":"nextSlide","click .gallery-related-link":"taboolaClick"},selectors:{endSlate:".endslate",slides:".slide:not(.partner-placement)",hiddenWhileSurvey:".p402_hide"},endSlateTemplate:'<% _.each(data, function(item) { %><li class="gallery-related-item"><a class="gallery-related-link" data-taboola-type="<%= item.type %>" data-taboola-id="<%= item.id %>" data-taboola-response-id="<%=response_id%>"href="<%= item.url %>"><span class="taboola-image-crop"><img src="<%= item.thumbnail[0].url %>" class="taboola-related-img" alt="" /></span><%= item.name %></a><span class="gallery-related-date"><%= item.created %></span></li><% }); %>',initialize:function(i){t.bindAll(this,"_showEndslate","setAdSize","beforeAdRender"),i=e.extend({ads:!0,slideTransition:0,imageLazySrcAttr:"data-src",lookAheadAmount:2,transitionSlides:null},i),this.index=i.index,s.prototype.initialize.call(this,i),this.adCount=0,this.googleSurveyNeeded=!1,o.getNested(window.site_vars,"ADS","GALLERY","SURVEY")&&(this.googleSurveyNeeded=!0),this._initializeAds(),this.endSlateBuilt=!1,this.isRotating=!1,this.galleryThumbnails=this.$(".gallery-thumbs")},destroy:function(){e.cookie("GoogleSurveyDropped")&&(e.cookie("GoogleSurveyDropped",""),0!==this.$el.parent(".p402_premium").length&&this.$el.unwrap(),e("#contain-402").remove()),this._destroySurveyCallback(),s.prototype.destroy.call(this)},_initializeAds:function(){var e,t,i,s,a,o;this.options.ads&&(this.galleryData=this.$el.data()||{},this.setAdCount(),e=this.getAdTargeting(),this.$sponsorshipAd=this.$(".snapshot-sponsor"),this.$sponsorshipAd.length&&(o=this._getSlideIn(this.index).data("qqid"),e.snapshotid=o,this.subviews.sponsorshipAd=new d({el:this.$sponsorshipAd,adPlacement:"sponsor_logo/snapshots",adSizes:["sponsor_logo"],targeting:e})),this.$viewport=this.$(".viewport"),i=this.$viewport.width(),t=this.$viewport.height(),a=n.getActivePageInfo().excludeTransitionAd,450>t||600>i?h.logWarn("Advertisement viewport is too small: "+i+"x"+t):a||(this.$adSlide=this.$(".partner-slide-ad"),this.$adContents=this.$(".partner-slide-ad .gallery-photo-border"),s=null,"snapshot"===this.galleryData.galleryId&&(s="transition_snapshot"),this.subviews.ad=new r({el:this.$adContents,adPlacement:"transition_gallery/"+this.galleryData.cst,adSizes:["elastic"],beforeAdRender:this.beforeAdRender,meterThreshold:s,rateMeterId:"gallery_"+this.galleryData.galleryId,targeting:e})))},setAdCount:function(){this.adCount++},getAdTargeting:function(){return{pageType:this.galleryData.basePageType,contentid:this.galleryData.galleryId,sitePage:"usat/"+(this.galleryData.ssts||"").replace(/\/\/*$/,""),series:this.galleryData.series,topic:this.galleryData.topic,count:this.adCount,surveyCookie:""+(e.cookie("GoogleSurveyTaken")||!1),surveyOn:this.googleSurveyNeeded.toString()}},completedSurvey:function(){if(e.cookie("GoogleSurveyTaken","true",{expires:1}),e.cookie("GoogleSurveyDropped",""),this.isRotating)this.options.carousel.autoplay();else{var t=this.options.carousel.subviews.controls.selectors,i=!!e(t.nextArrow).attr("data-lastClicked"),s="none"==e(t.prevArrow).css("display"),a=-1;(i||s)&&(a=1),this.options.carousel.switchSlide(null,a)}var o=this.options.carousel.subviews.controls.$el;o.find(this.selectors.hiddenWhileSurvey).css("display","block"),this._destroySurveyCallback()},_destroySurveyCallback:function(){if(window.USATGoogleSurvey){window.USATGoogleSurvey=void 0;try{delete window.USATGoogleSurvey}catch(e){}}},render:function(){this._loadImage(this.$$(this.selectors.slides).eq(this.index))},taboolaClick:function(t){if(!this.$overrideTaboola){var i=e(t.currentTarget);l.prototype.registerTaboolaClick(i.attr("data-taboola-id"),i.attr("data-taboola-type"),i.attr("data-taboola-response-id"),"end-slate")}},nextSlide:function(e){e.preventDefault(),this.options.carousel.switchSlide(null,1)},_buildEndslate:function(){var e=this.$(".gallery-endslate-related"),t=this.options.endslateOptions,i=[];if(this.endSlateBuilt=!0,t&&t.overrideTaboola){{t.currentGallery}i=t.endslateGalleries.join("-"),this.$(".override_taboola").hide(),n.fetchData("/picture-gallery/"+i+"/").done(function(t){e.html(t)},this)}else{var s=window.location.href;this.$el.hasClass("hasendslate")&&this.$el.data("gallery-id")&&(s=window.location.protocol+"//"+window.location.host+"/picture-gallery/"+this.$el.data("gallery-id")+"/");var a=new l;this.$$(this.selectors.endSlate).addClass("loading"),a.getRelated(this._showEndslate,"photo","photo",4,s,this.$el.data("gallery-id"),this.getPlacement())}},getPlacement:function(){switch(n.getActivePageInfo().texttype){case"gallery":return"Endslate - Cinematic Gallery";case"galleries":return"Endslate - Gallery";case"story":return"Endslate - Asset Gallery"}},_showEndslate:function(e){{var i=this.$$(this.selectors.endSlate).removeClass("loading");i.find(".gallery-endslate-related").attr("data-media-url")||""}if(t.each(e.list,function(e){e.thumbnail[0].url.indexOf("images.taboola.com")>-1&&(e.thumbnail[0].url=decodeURIComponent((e.thumbnail[0].url+"").replace(/\+/g,"%20")),e.thumbnail[0].url=e.thumbnail[0].url.replace("http://images.taboola.com/taboola/image/fetch/f_jpg,q_80,c_fill,g_face,e_sharpen/",""))}),1===i.length){var s=t.template(this.endSlateTemplate,{data:e.list,response_id:e.id});i.find(".gallery-endslate-related").html(s)}},goToSlide:function(t){var i=this._getSlideOut(),s=this._getSlideIn(t);return s.length?(this.index=t,a.trigger("carousel:switchSlide"),this.options.triggerAdRefresh&&a.trigger("carousel:refreshAd"),this._switchSlides(s,i)):e.Deferred().reject()},shouldShowAd:function(){return!this.showingAd&&this.options.ads&&this.subviews.ad&&this.subviews.ad.shouldShowAd()?!0:!1},showAd:function(){var i=this._getSlideOut();return this.showingAd=this.$adSlide,i[0]!==this.showingAd[0]?(this.$sponsorshipAd&&this.$sponsorshipAd.hide(),this._switchSlides(this.showingAd,i).done(t.bind(function(){if(e.cookie("GoogleSurveyDropped")+""=="true"){var t=this.options.carousel.subviews.controls.$el,i=this.selectors.hiddenWhileSurvey.substr(1);t.find(".media-playlist").wrap('<div class="'+i+'"></div>'),this.options.carousel.playTimer&&(this.isRotating=!0,this.options.carousel._stopCarouselRotate())}this.subviews.ad.playAd(),this.hideThumbnails()},this))):e.Deferred().reject()},hideThumbnails:function(){this.galleryThumbnails.hide()},showThumbnails:function(){this.galleryThumbnails.show()},_transitionSlides:function(e,i){var s=this.options.slideTransition;if(this.options.transitionSlides){var a=this.$$(this.selectors.slides);return this.options.transitionSlides(a.index(e),a.index(i))}return i.css({opacity:1}),this.animate(i,"opacity",0,s,"ease-in-out").then(t.bind(function(){return this._fadeInSlide(e,s).done(t.bind(function(){i.css({visibility:"hidden",opacity:0})},this))},this))},_switchSlides:function(e,i){return i===this.showingAd&&(this.subviews.ad.stopAd(),this.showThumbnails()),this._transitionSlides(e,i).then(t.bind(function(){if(i.removeClass("active"),i===this.showingAd){this.setAdCount();var t=this.getAdTargeting();this.subviews.ad.setTargeting(t),this.subviews.ad.refreshPosition(),this.showingAd=null}e!==this.showingAd&&this.$sponsorshipAd&&this.$sponsorshipAd.length&&this.refreshSponsorshipAd(e.data("qqid"))},this))},refreshSponsorshipAd:function(e){var t=this.getAdTargeting();t.snapshotid=e,this.subviews.sponsorshipAd.setTargeting(t),this.subviews.sponsorshipAd.refreshPosition()},_getSlideOut:function(){var e;return e=this.showingAd?this.showingAd:this.$$(this.selectors.slides).eq(this.index)},_getSlideIn:function(e){var t;return t=this.$$(this.selectors.slides).eq(e),this._loadImage(t,this.index>e),!this.endSlateBuilt&&t.hasClass("endslate")&&this._buildEndslate(),t},_loadImage:function(e,t){var i=this.options.lookAheadAmount;do this._fetchImage(e.find("img")),i--,e=t?e.prev():e.next();while(i>=0&&e.length>0)},_fetchImage:function(e){if(e.length>0&&o.lazyLoadImage(e,this.options.imageLazySrcAttr)){var i=e.parent();i.addClass("loading"),e.load(t.bind(function(){i.removeClass("loading"),this._resizeMeta(e)},this))}},_fadeInSlide:function(e,t){return e.css({visibility:"visible","z-index":1}),e.addClass("active"),this._resizeMeta(e.find(".gallery-photo")),this.animate(e,"opacity",1,t,"ease-in-out")},_resizeMeta:function(e){if(e.length){var t=this._getImageWidth(e);t&&e.parent().width(t)}},_getImageWidth:function(e){return e.width()},viewportResize:function(i,s){this.$(".active .gallery-photo").each(t.bind(function(t,i){this._resizeMeta(e(i))},this)),this.$adSlide&&this.subviews.ad&&(this.setAdSize(i,s),this.subviews.ad.resizeAd(i,s))},beforeAdRender:function(e){e.survey&&(window.USATGoogleSurvey={completedSurvey:t.bind(this.completedSurvey,this)}),this.setAdSize()},setAdSize:function(e,t){e=e||this.$viewport.outerWidth(),t=t||this.$viewport.outerHeight();var i=this.findSizeForAd(e,t);this.$adContents.removeClass("size-s size-m size-l size-xl").addClass(i.adSizeClass),this.subviews.ad.setInitialDimensions(e,t)},findSizeForAd:function(e,t){var i={adSizeClass:"size-s",marginTop:"5px"},s=450;return e>1080&&t>810?(i.adSizeClass="size-xl",s=810):e>936&&t>700?(i.adSizeClass="size-l",s=700):e>768&&t>576&&(i.adSizeClass="size-m",s=576),i.marginTop=(t-s)/2+"px",i}});return u});
//# sourceMappingURL=gallery.js
//# sourceMappingURL=gallery.js.map