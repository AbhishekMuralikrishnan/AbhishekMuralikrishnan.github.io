jQuery(document).ready(function(){
	
	d3.json("../data/json/timeline_data.json", function(error, data) {
	  	if (error) throw error;

	  	var items = data;
	  	function getDate(d) {
			/*	If d is a number or a string in the format Day Month Year
			process it as normal. Other wise presume that it may be a string 
			in the format Month Year and add 1 to the start so that Firefox
			and safari can parse the date */
			if (typeof d === "number") {
					return new Date(d);
			} else if (Date.parse(d)) {
					return new Date(d);
			} else {
					return new Date("1 " + d);
			}
		}
		items.forEach(function(d) {
			d.date1 = getDate(d.dateStart);
			d.date2 = getDate(d.dateEnd);
		});
		for (var i = 0; i < items.length; i++) {
			jQuery("#right_container .info-box .panel").append('<div class="event-' + i + '"></div>');
		};

		for (var i = 0; i < jQuery('#right_container div[class^="event"]').length; i++) {
			if (items[i].img) {
				jQuery('#right_container div[class="event-' + i + '"]')
						.append('<span class="timeline-img"> <img src="' + items[i].img + '"/></span>');
			}

			if (items[i].date1 < items[i].date2) {
				jQuery('#right_container div[class="event-' + i + '"]')
						.append('<h3>' + items[i].dateStart + ' - ' + items[i].dateEnd + '</h3>');
			} else {
				jQuery('#right_container div[class="event-' + i + '"]')
						.append('<h3>' + items[i].dateStart + '</h3>');
			}

			if (items[i].headline) {
				jQuery('#right_container div[class="event-' + i + '"]')
						.append('<h4>' + items[i].headline + ' (' + (i + 1) + ' of ' + items.length + ')</h4>');
			} else {
				jQuery('#right_container div[class="event-' + i + '"]')
						.append('<h4> (' + (i + 1) + ' of ' + items.length + ')</h4>');
			}

			if (items[i].text) {
				jQuery('#right_container div[class="event-' + i + '"]')
						.append('<p>' + items[i].text + '</p>');
			}

			if (items[i].link) {
				jQuery('#right_container div[class="event-' + i + '"]')
						.append('<p>' + items[i].link + '</p>');
			}
		};
		var duration = 200;
		var marginTop = 5;
		var marginRight = 0;
		var marginBottom = 40;
		var marginLeft = 0;
		var padding = 2;
		var width = 630 - marginRight - marginLeft;
		var height = 290 - marginTop - marginBottom;
		var miniHeight = 75;
		var mainHeight = height - miniHeight - 50;
		var eventWidth = jQuery(".info-box").width();
		var position = 0;

		var panelWidth = eventWidth * items.length;

		jQuery("#right_container .info-box .panel").css({
				"width": panelWidth + "px"
		});

		/*	A global variable to control which event/location to show */
		var counter = 0;

		/*	A global variable to control the amout of ticks visible */
		var ticks = 8;

		/*	Find the earliest and latest time in the range */
		var timeFirst = d3.min(items, function(d) {
				return d.date1;
		});
		var timeLast = d3.max(items, function(d) {
				return d.date2;
		});

		/*	Work out the time span of the whole timeline in miliseconds plus one tenth of this value */
		var timeDiff = timeLast - timeFirst;
		timeDiff = timeDiff + (timeDiff * 0.1);

		/*	Extend the time range before the first date and after the last date 
		to make for a more attractive timeline */
		var timeBegin = getDate(items[counter].date1.getTime() - timeDiff);
		var timeEnd = getDate(items[counter].date1.getTime() + timeDiff);

		/* Scales */
		var x = d3.scaleTime()
				.domain([timeBegin, timeEnd])
				.range([0, width]);

		/*	Create the SVG and its elements */
		var chart = d3.select(".timeline")
				.append("svg")
				.attr("width", width + marginRight + marginLeft)
				.attr("height", height + marginTop + marginBottom)
				.attr("class", "chart");

		var leftIcon = chart.append("path")
				.attr("d", "M20.834,8.037L9.641,14.5c-1.43,0.824-1.43,2.175,0,3l11.193,6.463c1.429,0.826,2.598,0.15,2.598-1.5V9.537C23.432,7.887,22.263,7.211,20.834,8.037z")
				.style("pointer-events", "none")
				.attr("transform", "translate(0,0), scale(1.5)");

		var leftButton = chart.append("rect")
				.attr("width", 50)
				.attr("height", 50)
				.style("fill", "rgb(94, 94, 94)")
				.style("opacity", 0.2)
				.attr("transform", "translate(0,0)")
				.style("cursor", "pointer")
				.on("click", function(e) {
						if (counter > 0) {
								counter -= 1;
						};

						showLocation();
						d3.event.preventDefault();
						return false;
				})
				.on("mouseover", function() {

						if (counter > 0) {
								d3.select(this).transition()
										.duration(duration)
										.style("opacity", 0.5);
						};
				})
				.on("mouseout", function() {
						d3.select(this).transition()
								.duration(duration)
								.style("opacity", 0.2);
				});

		var rightIcon = chart.append("path")
				.attr("d", "M11.166,23.963L22.359,17.5c1.43-0.824,1.43-2.175,0-3L11.166,8.037c-1.429-0.826-2.598-0.15-2.598,1.5v12.926C8.568,24.113,9.737,24.789,11.166,23.963z")
				.style("pointer-events", "none")
				.attr("transform", "translate(50,0), scale(1.5)");

		var rightButton = chart.append("rect")
				.attr("width", 50)
				.attr("height", 50)
				.style("fill", "rgb(94, 94, 94)")
				.style("opacity", 0.2)
				.attr("transform", "translate(50,0)")
				.style("cursor", "pointer")
				.on("click", function(e) {
						if (counter < (items.length - 1)) {
								counter += 1;
						};

						showLocation();
						d3.event.preventDefault();
						return false;
				})
				.on("mouseover", function() {

						if (counter < (items.length - 1)) {
								d3.select(this).transition()
										.duration(duration)
										.style("opacity", 0.5);
						};

				})
				.on("mouseout", function() {
						d3.select(this).transition()
								.duration(duration)
								.style("opacity", 0.2);
				});

		chart.append("defs").append("clipPath")
				.attr("id", "clip")
				.append("rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", width)
				.attr("height", height + marginTop + marginBottom);

		chart.append("g")
				.append("rect")
				.attr("x", 0)
				.attr("y", (height - miniHeight))
				.attr("width", width)
				.attr("height", miniHeight)
				.attr("fill", "#E1E4E9")
				.style("opacity", 0.5);

		var miniHolder = chart.append("g")
				.attr("clip-path", "url(#clip)");

		var mini = miniHolder.append("g")
				.attr("width", width)
				.attr("height", miniHeight)
				.attr("class", "mini")
				.attr("transform", "translate(0," + (height - miniHeight) + ")")

		/* create three seperate x axis for Year, Month and Day based on the same x scale */
		var xYearAxis = d3.axisTop(x)
				.tickSize(15, 0)
				.ticks(d3.timeYear, 1)
				.tickFormat(d3.timeFormat('%Y'));

		var yearAxis = mini.append('g')
				.attr('class', 'year-axis')
				.call(xYearAxis);

		/* draw the static triangle to act as a pointer */
		chart.append("path")
				.attr("d", "M10,0 L20,20 L0,20z")
				.style("fill", "rgb(153, 153, 153)")
				.style("pointer-events", "none")
				.attr("transform", "translate(" + ((width / 2) - 10) + "," + height + ")");

		var locations = mini.append("g").selectAll("rect")
						.data(items)
						.enter()
						.append("rect")
						.attr("class", function(d, i) {
								if (i === counter) {
										return "locations selected";
								} else {
										return "locations";
								};
						})
						.attr("x", function(d, i) {
								return x(d.date1);
						})
						.attr("y", function(d, i) {
								/*	Work out if the first date of the current range overlaps the last date of the previous
								if so move the current rect down so that there is no overlap*/
								var prev = 0;

								if (i > 0) {
										prev = i - 1;
								}

								if (i === 0) {
										return 0;
								} else if (items[prev].date2 < items[i].date1) {
										return 0;
								} else {
										return (miniHeight - 10) / 2;
								}
						})
						.attr("width", function(d) {
								if (d.date1 < d.date2) {
										/* 	decide the width of the rect based on the range of dates */
										return x(d.date2) - x(d.date1);
								} else {
										/* 	if no end date is specified add 86,400,000 milliseconds (1 day) to the first
										date to create a span of time for the width
										but make sure that it is at least 4 px wide */
										var thisWidth = x(getDate(d.date1.getTime() + 86400000)) - x(d.date1);

										if (thisWidth < 4) {
												return 4;
										} else {
												return thisWidth;
										}
								}
						})
						.attr("height", function(d, i) {
								/*	Work out if the first date of the current range overlaps the last date of the previous
								if so half the height of the block to accomadate */
								var prev = 0;
								var next;

								if (i > 0) {
										prev = i - 1;
								}

								if (i < items.length - 1) {
										next = i + 1
								} else {
										next = items.length - 1;
								}

								if (prev > 0 && i!=next) {
										if (items[i].date2 > items[next].date1) {
												return (miniHeight - 10) / 2;
										} else if (items[prev].date2 > items[i].date1) {
												return (miniHeight - 10) / 2;
										} else {
												return (miniHeight - 10);
										}
								} else {
										return (miniHeight - 10);
								}

						})
						.on("mouseover", function(d, i) {

								if (d.date1 < d.date2) {
										d3.select("#right_container .timeline .tooltip")
												.html("<p>" + d.dateStart + " - <br />" + d.dateEnd + "</p>");
								} else {
										d3.select("#right_container .timeline .tooltip")
												.html("<p>" + d.dateStart + "</p>");
								}

								var eventLeft = parseInt(d3.select(this).attr("x"));
								var eventWidth = parseInt(d3.select(this).attr("width"));

								var eventTop = parseInt(d3.select(this).attr("y"));

								var tooltipHeight = parseInt(jQuery("#right_container .timeline .tooltip").css("height"));

								jQuery("#right_container .timeline .tooltip")
										.css({
												"left": eventLeft + (eventWidth / 2) + 250 + "px",
												"top": 145 - (tooltipHeight - eventTop) + "px"
										});

								jQuery("#right_container .timeline .tooltip").css({
										"opacity": 1,
										"display": "block"
								});

						})
						.on("mouseout", function() {
								jQuery("#right_container .timeline .tooltip").css({
										"opacity": 0,
										"display": "none"
								});
						})
						.on("click", function(d, i) {
								counter = i;

								showLocation();

								jQuery("#right_container .timeline .tooltip").css({
										"opacity": 0,
										"display": "none"
								});

								d3.event.preventDefault();
								return false;
						})

							/*	Function to add the info for the next selected location
						Adds the relevent content to info-box and provides a new value for xPosition
						to center the timeline on the selected location*/
		function showLocation() {

				position = eventWidth * counter;

				jQuery('#right_container .info-box').animate({
						scrollLeft: position
				}, duration);

				/*	Recalculate the start and end point of the time range based upon
				the current location and the zoom level */
				timeBegin = getDate(items[counter].date1.getTime() - timeDiff);
				timeEnd = getDate(items[counter].date1.getTime() + timeDiff);

				/*	Replace the values used in the x domain */
				x.domain([timeBegin, timeEnd]);

				/*	Redraw each x axis based on the new domain */
				yearAxis.transition()
						.duration(duration)
						.call(xYearAxis);

				/*	Give the selected location the class of 'selected'
				then animate the locations to their new position based on the updated x scale */
				locations.classed("selected", false)
						.attr("class", function(d, i) {
							if (i === counter) {
									return "locations selected";
							} else {
									return "locations";
							};
						})
						.transition()
						.duration(duration)
						.attr("x", function(d, i) {
							return x(d.date1);
						})
						.attr("width", function(d) {
							if (d.date1 < d.date2) {
								/* 	decide the width of the rect based on the range of dates */
								return x(d.date2) - x(d.date1);
							} else {
								/* 	if no end date is specified add 86,400,000 milliseconds to the first
								date to create a span of time for the width
								but make sure that it is at least 4 px wide */
								var thisWidth = x(getDate(d.date1.getTime() + 86400000)) - x(d.date1);

								if (thisWidth < 4) {
										return 4;
								} else {
										return thisWidth;
								}
							}
						});

				/*	Fade out the next/prev when they are not available */
				switch (counter) {
						case 0:
								leftIcon.style("fill", "rgb(196, 196, 196)");
								rightIcon.style("fill", "rgb(112, 112, 112)");
								break;
						case (items.length - 1):
								leftIcon.style("fill", "rgb(112, 112, 112)");
								rightIcon.style("fill", "rgb(196, 196, 196)");
								break;
						default:
								leftIcon.style("fill", "rgb(112, 112, 112)");
								rightIcon.style("fill", "rgb(112, 112, 112)");
								break;
				}

		}

		/* Initial call of show position to adjust the timeline on page load */
		showLocation();
	});
});