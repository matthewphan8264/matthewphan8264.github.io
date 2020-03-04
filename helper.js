window.myD3Helper = {
    sendMessage(message) {
        alert(message);
    },
    getWindowSize() {
        return [window.innerHeight, window.innerWidth];
    },
    test: function(refresh, companions, endpoints, endpointRSSI, inputIn, width, height) {
        var width = width;
        var height = height;

        var baseNodes = [];
        var baseLinks = [];
        var companionNodes = {};
        var endpointNodes = {};
        var companionLinks = {};
        var endpointDownLinks = {};

        var initializing = true;
        var movementOff = false;

        var currentDataPointer = 0;
        var healthyrssi = -30;
        var neutralrssi = -90;

        function key(obj) {
            return obj.b;
        }
        var distanceLength = 500;

        var nodehovered = false;
        var linkhovered = false;
		var companionHovered = false;
		var hoveredID = "";

		function reloadData(newState, companions, endpoints, endpointRSSI) {
			if (newState) {
				companionNodes = {};
				endpointNodes = {};
				companionLinks = {};
				endpointDownLinks = {};
			}
			loadData(companions, endpoints, endpointRSSI);
		}

		function testing() {
		}
		function testing2() {
		}
        loadData(companions, endpoints, endpointRSSI);

        function loadData(companions, endpoints, endpointRSSI) {
            baseNodes = [];
            baseLinks = [];

            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            if (companionNodes["User"] === undefined) {
                companionNodes["User"] = {
                    name: "User",
                    id: "User",
                    level: 1,
                    lastseen: dateTime,
                };
            } else {
                companionNodes["User"].lastseen = dateTime;
            }

            companions.forEach(function(companion) {
                if (companionNodes[key(companion)] === undefined) {
                    companionNodes[key(companion)] = {
                        name: companion.a,
                        id: companion.b,
                        level: 2,
                        //networkid: companion.networkid,
                    }
                }
            });
            companions.forEach(function(companion) {
                var rssi = 999
                if (companionLinks[key(companion)] === undefined) {
                    companionLinks[key(companion)] = {
                        target: "User",
                        source: companion.b,
                        duallink: false,
                        linktype: 'down',
                        type: 'companion',
                        strength: 1,
                        distance: distanceLength + 200,
                        status: getStatus(rssi),
                        rssi: rssi,
                    }
                } else {
                    companionLinks[key(companion)].rssi = rssi;
                    companionLinks[key(companion)].status = getStatus(rssi);
                }
            });

            addEndpoints(companions, endpoints, endpointRSSI);
            addToArrays();

            if (!initializing) {
                movementOff = true;
                update();
            }
        }

        function addEndpoints(companions, endpoints, endpointRSSI) {
            companions.forEach(function(companion) {
				var rssiIndex = 0
                endpoints.forEach(function(endpoint) {
                    if (endpoint.c === companion.b) {

                        var rssi = endpointRSSI[rssiIndex]

                        if (endpointNodes[key(endpoint)] === undefined) {
                            endpointNodes[key(endpoint)] = {
                                name: endpoint.a,
                                id: endpoint.b,
                                level: 3,
                                master: false,
                                //networkid: endpoint.networkid,
                            }
                        }

                        if (endpointDownLinks[key(endpoint)] === undefined) {
                            endpointDownLinks[key(endpoint)] = {
                                target: endpoint.b,
                                source: companion.b,
                                duallink: false,
                                linktype: 'down',
                                type: 'endpoint',
                                strength: 1,
                                distance: distanceLength,
                                status: getStatus(rssi),
                                rssi: rssi,
                            };
                        } else {
                            endpointDownLinks[key(endpoint)].rssi = rssi;
                            endpointDownLinks[key(endpoint)].status = getStatus(rssi);
                        }
                    }
					rssiIndex = rssiIndex + 1;
                });
            });
        }

        function addToArrays() {
            newNodes = []
            newLinks = []
            for (var value in companionNodes) {
                if (companionNodes[value] != undefined) {
                    baseNodes.push(companionNodes[value]);
                }
            }
            for (var value in endpointNodes) {
                if (endpointNodes[value] != undefined) {
                    baseNodes.push(endpointNodes[value]);
                }
            }
            for (var value in companionLinks) {
                if (companionLinks[value] != undefined) {
                    baseLinks.push(companionLinks[value]);
                }
            }
            for (var value in endpointDownLinks) {
                if (endpointDownLinks[value] != undefined) {
                    baseLinks.push(endpointDownLinks[value]);
                }
            }
        }

        function getStatus(rssi) {
            if (rssi == 999) {
                return "disconnected";
            } else if (rssi >= healthyrssi) {
                return "healthy";
            } else if (rssi >= neutralrssi) {
                return "neutral";
            } else if (rssi != 999) {
                return "unhealthy";
            }

        }

        var element = document.getElementsByTagName('flt-platform-view')[0].shadowRoot.getElementById('networkgraph')
        var svg = d3.select(element)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", 'lightskyblue')
            .append("g")
            .attr("class", "everything");
        var actualSVG = d3.select(element)
            .select("svg");
        var zoom = d3.zoom();
        var zoom_handler = zoom
            .on("zoom", zoom_actions);

        actualSVG.call(zoom_handler);
        var zoomScale = 1;

        function zoom_actions() {
            svg.attr("transform", d3.event.transform);

            if (zoomScale != d3.event.transform.k) {
                zoomScale = d3.event.transform.k;
            }
        }

        loadMarkers();

        function addMarker(markerid, color) {
            svg.append('defs').append('marker')
                .attr('id', markerid)
                .attr('viewBox', '-0 -5 10 10')
                .attr('refX', 5)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 3)
                .attr('markerHeight', 3)
                .attr('xoverflow', 'visible')
                .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', color)
                .style('stroke', 'none');
        }

        function loadMarkers() {
            addMarker('healthyMarker', '#007948');
            addMarker('unhealthyMarker', '#ff5565');
            addMarker('neutralMarker', '#fffa94');
            addMarker('disconnectedMarker', '#000000');
        }

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) {
                    return d.id;
                })
                .distance(function(d) {
                    return d.distance;
                })
                .strength(function(d) {
                    return d.strength;
                }))
            .force("charge", d3.forceManyBody().strength(function(d, i) {
                return i == 0 ? 10 * -500 : 10 * -500
            }))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", tick)

        update();

        function getNodeColor(node) {
            if (node.level == 1) {
                return 'white';
            } else if (node.level == 2) {
                return '#8EC549';
            } else if (node.level == 3) {
                return '#00AFEC';
            } else {
                return 'black';
            }
        }

        function update() {
            initializing = false;

            simulation.nodes(baseNodes);
            simulation.force("link").links(baseLinks);

			try {
				if (nodehovered) {
					var selectedNode = undefined;
					if (companionHovered) {
						selectedNode = companionNodes[hoveredID];
					} else {
						selectedNode = endpointNodes[hoveredID];
					}
					if (selectedNode != undefined) {
						inputIn.fy = true;
						inputIn.go = selectedNode.level;
						inputIn.id = selectedNode.id;
						inputIn.cx.$0();
					}
				} else if (linkhovered) {
					var selectedLink = undefined;
					if (companionHovered) {
						selectedLink = companionLinks[hoveredID];
					} else {
						selectedLink = endpointDownLinks[hoveredID];
					}
					if (selectedLink != undefined) {
						inputIn.fy = true;
						inputIn.go = 0;
						inputIn.k1 = selectedLink.rssi;
						inputIn.cx.$0();
					}
				}
			} catch (err) {
				console.log(err)
			}

            //Renable for standstill graph
            //simulation.tick(500);

            node = svg.selectAll(".node").data(baseNodes);
            node.exit().remove();
            node = node.enter()
                .append("circle")
                .attr("class", "node")
                .attr("r", function(d) {
                    return getNodeSize(d.level)
                })
                .style("fill", function(d) {
                    return getNodeColor(d);
                })
                .on("mouseover", function(d) {
					inputIn.fy = true;
					inputIn.go = d.level;
					inputIn.id = d.id;
					inputIn.cx.$0();
					hoveredID = d.id;
					companionHovered = d.type == 'companion';
					nodehovered = true;
					linkhovered = false;
                })
                .on("mouseout", function(d) {
					//nodehovered = false;
                })
                .on("click", function(d) {

                })
                .merge(node);
            /*.call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
                .attr("xlink:href", function (d) { return "https://cdn.discordapp.com/emojis/551872136764194824.png?v=1"; })*/
            nodeimage = svg.selectAll(".nodeimage").data(baseNodes);
            nodeimage.exit().remove();
            nodeimage.enter()
                .append("image")
                .attr("class", "nodeimage")

                .on("mouseover", function(d) {
					inputIn.fy = true;
					inputIn.go = d.level;
					inputIn.id = d.id;
					inputIn.cx.$0();
					hoveredID = d.id;
					companionHovered = d.type == 'companion';
					nodehovered = true;
					linkhovered = false;
                })
                .on("mouseout", function(d) {
                    //nodehovered = false;
				})
                .on("click", function(d) {
                    //selectNode(d.id, d.level);
                })
                //.attr("xlink:href", function (d) { console.log(window.location.href.replace("networkgraph", "") + "icon-jeeva.png"); return window.location.href.replace("networkgraph", "") + "icon-jeeva.png"; })
                .merge(nodeimage);

            sublink = svg.selectAll(".sublink").data(baseLinks);
            sublink.exit().remove();
            sublink.enter()
                .append("line")
                .attr("class", "sublink")
                .style("stroke-width", "1px")
                .style("stroke", "black")
                .style("stroke-dasharray", "3")
                .merge(sublink);

            link = svg.selectAll(".link").data(baseLinks);
            link.exit().remove();
            link = link.enter()
                .append("line")
                .attr("class", "link")
                .attr('marker-end', function(d) {
                    if (d.status === "healthy") {
                        return 'url(#healthyMarker)';
                    } else if (d.status === "neutral") {
                        return 'url(#neutralMarker)';
                    } else if (d.status === "unhealthy") {
                        return 'url(#unhealthyMarker)';
                    } else if (d.target === "User") {
                        return null;
                    } else {
                        return 'url(#disconnectedMarker)';
                    }
                })
                .style("stroke", function(d) {
                    if (d.status === "healthy") {
                        return '#007948';
                    } else if (d.status === "neutral") {
                        return '#fffa94';
                    } else if (d.status === "unhealthy") {
                        return '#ff5565';
                    } else {
                        return '#000000';
                    }
                })
                .style("stroke-width", function(d) {
                    if (d.target.name === "User") {
                        return "0px";
                    } else {
                        return "20px";
                    }
                })
                .on("mouseover", function(d) {
                    inputIn.fy = true;
					inputIn.go = 0;
					inputIn.k1 = d.rssi;
					inputIn.cx.$0();
					hoveredID = d.target.id;
					companionHovered = d.type == 'companion';
					linkhovered = true;
					nodehovered = false;
                })
                .on("mouseout", function(d) {
                    //linkhovered = false;
                })
                .merge(link);

            simulation.alphaTarget(1).restart();
            //Renable for standstill graph
            /*if (newState) {
                simulation.alphaTarget(1).restart();
                newState = false;
            }
            else if (movementOff === true) {
                simulation.alphaTarget(.00000001).restart();
            }
            else {
                simulation.alphaTarget(1).restart();
            }*/
        }

        function tick() {
            node
                .attr("test", function(d) {
                    //nodeTextFunction(d);
                })
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                })
                .style("fill", function(d) {
                    return getNodeColor(d);
                })

            svg.selectAll(".nodeimage")
                .attr("test", function(d) {
                    //nodeTextFunction(d);
                })
                .attr("x", function(d) {
                    return d.x - 40;
                })
                .attr("y", function(d) {
                    return d.y - 40;
                })

            link
                .attr("test", function(d) {
                    //linkTextFunction(d);
                })
                .attr("x1", function(d) {
                    if (d.duallink === true) {
                        var x = (d.target.x - d.source.x) / 2 + d.source.x;
                        return x;
                    }
                    return adjustArrows(d.source.x, d.target.x, d.rssi);
                })
                .attr("y1", function(d) {
                    if (d.duallink === true) {
                        var y = (d.target.y - d.source.y) / 2 + d.source.y;
                        return y;
                    }
                    return adjustArrows(d.source.y, d.target.y, d.rssi);
                })
                .attr("x2", function(d) {
                    return adjustArrows(d.target.x, d.source.x, d.rssi);
                })
                .attr("y2", function(d) {
                    return adjustArrows(d.target.y, d.source.y, d.rssi);
                })
                .attr('marker-end', function(d) {
                    if (d.status === "healthy") {
                        return 'url(#healthyMarker)';
                    } else if (d.status === "neutral") {
                        return 'url(#neutralMarker)';
                    } else if (d.target.name === "User") {
                        return null;
                    } else if (d.status === "unhealthy") {
                        return 'url(#unhealthyMarker)';
                    } else {
                        return 'url(#disconnectedMarker)';
                    }
                })
                .style("stroke", function(d) {
                    if (d.status === "healthy") {
                        return '#007948';
                    } else if (d.status === "neutral") {
                        return '#fffa94';
                    } else if (d.status === "unhealthy") {
                        return '#ff5565';
                    } else {
                        return '#000000';
                    }
                })
                .style("stroke-width", function(d) {
                    if (d.target.name === "User") {
                        return "0px";
                    } else {
                        return "20px";
                    }
                })

            svg.selectAll(".sublink")
                .attr("x1", function(d) {
                    return adjustDottedLines(d.source.x, d.target.x);
                })
                .attr("y1", function(d) {
                    return adjustDottedLines(d.source.y, d.target.y);
                })
                .attr("x2", function(d) {
                    return adjustDottedLines(d.target.x, d.source.x);
                })
                .attr("y2", function(d) {
                    return adjustDottedLines(d.target.y, d.source.y);
                })

            //Renable for standstill graph
            /*if (movementOff === true) {
                simulation.stop();
            }*/
        }

        function getNodeSize() {
            return 40;
        }

        function adjustArrows(val1, val2, rssi) {
            if (rssi === 999) {
                let x = (val2 - val1) / 100 * 40;
                return val1 + x;
            }

            rssi = rssi / 3.33 * -1
            if (rssi > 40) {
                rssi = 40
            }
            if (rssi < 10) {
                rssi = 10
            }

            var difference = rssi - 15;
            rssi = 15 - difference;
            var temp = 100 - (40 - rssi);
            let x = (val2 - val1) / 100 * temp;
            return val1 + x;
        }

        function adjustDottedLines(val1, val2) {
            let x = (val2 - val1) / 100 * 10;
            return val1 + x;
        }

        function resetLocation() {
            actualSVG.call(zoom_handler.transform, d3.zoomIdentity);
        }

        function testPrint() {
            console.log("testing function");
        }

        var functionsOut = [resetLocation, testPrint, reloadData, testing, testing2];
        return functionsOut;
    },

}