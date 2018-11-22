/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2018, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

define(
    ['./ViewConfiguration'],
    function (ViewConfiguration) {
        class ElementViewConfiguration extends ViewConfiguration {

            static create(type, openmct) {
                const DEFAULT_DIMENSIONS = [2, 1],
                      DEFAULT_X = 1,
                      DEFAULT_Y = 1;
                const INITIAL_STATES = {
                    "image": {
                        stroke: "transparent"
                    },
                    "box": {
                        fill: "#717171",
                        stroke: "transparent"
                    },
                    "line": {
                        x: 5,
                        y: 3,
                        x2: 6,
                        y2: 6,
                        stroke: "#717171"
                    },
                    "text": {
                        fill: "transparent",
                        stroke: "transparent",
                        size: "13px",
                        color: ""
                    }
                };
                const DIALOGS = {
                    "image": {
                        name: "Image Properties",
                        sections: [
                            {
                                rows: [
                                    {
                                        key: "url",
                                        control: "textfield",
                                        name: "Image URL",
                                        "cssClass": "l-input-lg",
                                        required: true
                                    }
                                ]
                            }
                        ]
                    },
                    "text": {
                        name: "Text Element Properties",
                        sections: [
                            {
                                rows: [
                                    {
                                        key: "text",
                                        control: "textfield",
                                        name: "Text",
                                        required: true
                                    }
                                ]
                            }
                        ]
                    }
                };

                let element = INITIAL_STATES[type] || {};
                element = JSON.parse(JSON.stringify(element));
                element.position = [
                    element.x || DEFAULT_X,
                    element.y || DEFAULT_Y
                ];
                element.dimensions = DEFAULT_DIMENSIONS;
                element.type = type;

                return DIALOGS[type] ?
                    openmct.$injector.get('dialogService').getUserInput(DIALOGS[type], element) :
                    element;
            }

            /**
             * @param {Object} configuration the element (line, box, text or image) view configuration
             * @param {Object} configuration.element
             * @param {Object} configuration.domainObject the telemetry domain object
             * @param {Object} configuration.rawPosition an object that holds raw position and dimensions
             * @param {Object} configuration.openmct the openmct object
             */
            constructor({element, ...rest}) {
                rest.rawPosition = {
                    position: element.position,
                    dimensions: element.dimensions
                };
                super(rest);
                this.element = element;
            }

            path() {
                return "configuration.elements[" + this.element.index + "]";
            }

            observeProperties() {
                [
                    "width",
                    "height",
                    "stroke",
                    "fill",
                    "x",
                    "y",
                    "x1",
                    "y1",
                    "x2",
                    "y2",
                    "color",
                    "size",
                    "text",
                    "url"
                ].forEach(property => {
                    this.attachListener(property, newValue => {
                        console.log("newValue", newValue, "property", property);
                        this.element[property] = newValue;
                    });
                });

                // TODO: attach listener for useGrid
            }
        }

        return ElementViewConfiguration;
    }
);
