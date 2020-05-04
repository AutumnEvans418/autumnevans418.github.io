/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2017
 * @compiler Bridge.NET 17.10.1
 */
Bridge.assembly("Minesweeper", function ($asm, globals) {
    "use strict";

    Bridge.define("Minesweeper.BaseCell", {
        inherits: [System.ComponentModel.INotifyPropertyChanged],
        fields: {
            _flag: false,
            _value: 0,
            _bomb: false,
            _visible: false,
            IsHighlighted: false,
            Row: 0,
            Column: 0,
            XOffset: 0,
            YOffset: 0,
            Width: 0
        },
        events: {
            VisualChange: null,
            PropertyChanged: null
        },
        props: {
            ShowBomb: {
                get: function () {
                    return this.Visible && this.Bomb;
                }
            },
            ShowValue: {
                get: function () {
                    return this.Visible && this.Value > 0;
                }
            },
            ShowEmpty: {
                get: function () {
                    return this.Visible && this.Value <= 0 && !this.Bomb;
                }
            },
            ShowFlag: {
                get: function () {
                    return !this.Visible && this.Flag;
                }
            },
            Flag: {
                get: function () {
                    return this._flag;
                },
                set: function (value) {
                    this._flag = value;
                    this.OnPropertyChanged();
                    this.Show();
                }
            },
            Value: {
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    this._value = value;
                    this.OnPropertyChanged();
                    this.Show();
                }
            },
            Bomb: {
                get: function () {
                    return this._bomb;
                },
                set: function (value) {
                    this._bomb = value;
                    this.OnPropertyChanged();
                    this.Show();
                }
            },
            Visible: {
                get: function () {
                    return this._visible;
                },
                set: function (value) {
                    this._visible = value;
                    this.OnPropertyChanged();
                    this.Show();
                }
            },
            X: {
                get: function () {
                    return this.Column * this.Width + this.XOffset;
                }
            },
            Y: {
                get: function () {
                    return this.Row * this.Width + this.YOffset;
                }
            }
        },
        alias: ["addPropertyChanged", "System$ComponentModel$INotifyPropertyChanged$addPropertyChanged",
        "removePropertyChanged", "System$ComponentModel$INotifyPropertyChanged$removePropertyChanged"],
        ctors: {
            ctor: function () {
                this.$initialize();
                this.Visible = false;
            }
        },
        methods: {
            Show: function () {
                !Bridge.staticEquals(this.VisualChange, null) ? this.VisualChange(this, { }) : null;
            },
            Highlight: function () {
                this.IsHighlighted = true;
                this.Show();
            },
            UnHighLight: function () {
                this.IsHighlighted = false;
                this.Show();
            },
            Hit: function (x, y) {
                return (x > this.X && x < this.X + this.Width && y > this.Y && y < this.Y + this.Width);
            },
            DisplayValue: function () {
                if (this.ShowBomb) {
                    return "X";
                }
                if (this.ShowEmpty) {
                    return "0";
                }
                if (this.ShowFlag) {
                    return "F";
                }
                if (this.ShowValue) {
                    return Bridge.toString(this.Value);
                }
                return " ";
            },
            toString: function () {
                return System.String.format("({0},{1}): {2},Value:{3},Bomb:{4}", Bridge.box(this.Column, System.Int32), Bridge.box(this.Row, System.Int32), (this.ShowBomb ? "x" : this.ShowEmpty ? "_" : this.ShowFlag ? "F" : this.ShowValue ? Bridge.toString(this.Value) : ""), Bridge.box(this.Value, System.Int32), Bridge.box(this.Bomb, System.Boolean, System.Boolean.toString));
            },
            OnPropertyChanged: function (propertyName) {
                if (propertyName === void 0) { propertyName = null; }
                !Bridge.staticEquals(this.PropertyChanged, null) ? this.PropertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName)) : null;
            },
            OnVisualChange: function () {
                !Bridge.staticEquals(this.VisualChange, null) ? this.VisualChange(this, { }) : null;
            }
        }
    });

    Bridge.define("Minesweeper.IFitnessVal", {
        $kind: "interface"
    });

    Bridge.define("Minesweeper.Cell", {
        fields: {
            _cell: null,
            _canvas: null
        },
        ctors: {
            ctor: function (cell, canvas) {
                this.$initialize();
                this._cell = cell;
                this._canvas = canvas;
                this._cell.addVisualChange(Bridge.fn.bind(this, function (sender, args) {
                    this.Show();
                }));
            }
        },
        methods: {
            Highlight: function () {
                var context = this._canvas.getContext("2d");
                context.fillStyle = Minesweeper.Theme.HighlightColor;
                context.fillRect(this._cell.X, this._cell.Y, this._cell.Width, this._cell.Width);
                context.fillStyle = Minesweeper.Theme.DefaultFill;
            },
            UnHighLight: function () {
                var context = this._canvas.getContext("2d");
                context.fillStyle = Minesweeper.Theme.CellColor;
                context.fillRect(this._cell.X, this._cell.Y, this._cell.Width, this._cell.Width);
                context.fillStyle = Minesweeper.Theme.DefaultFill;
            },
            Show: function () {
                var context = this._canvas.getContext("2d");

                if (this._cell.IsHighlighted) {
                    this.Highlight();
                } else {
                    this.UnHighLight();
                }

                if (this._cell.ShowBomb) {
                    context.fillStyle = Minesweeper.Theme.BombBackgroundColor;
                    context.fillRect(this._cell.X, this._cell.Y, this._cell.Width, this._cell.Width);

                    context.fillStyle = Minesweeper.Theme.BombColor;
                    context.font = Minesweeper.Theme.BombFont;
                    context.fillText("X", this._cell.X, this._cell.Y + this._cell.Width, this._cell.Width);
                    context.fillStyle = Minesweeper.Theme.DefaultFill;
                } else if (this._cell.ShowValue) {
                    context.font = Minesweeper.Theme.ValueFont;
                    context.fillText(Bridge.toString(this._cell.Value), this._cell.X + this._cell.Width / 2, this._cell.Y + this._cell.Width / 2, this._cell.Width);
                } else if (this._cell.ShowEmpty) {
                    context.fillStyle = Minesweeper.Theme.EmptyCellColor;
                    context.fillRect(this._cell.X, this._cell.Y, this._cell.Width, this._cell.Width);
                    context.fillStyle = Minesweeper.Theme.DefaultFill;
                }
                if (this._cell.ShowFlag) {
                    context.fillStyle = Minesweeper.Theme.FlagColor;
                    context.font = Minesweeper.Theme.FlagFont;
                    context.fillText("F", this._cell.X, this._cell.Y + this._cell.Width, this._cell.Width);
                    context.fillStyle = Minesweeper.Theme.DefaultFill;
                } else {
                    context.strokeStyle = Minesweeper.Theme.CellStrokeColor;
                    context.strokeRect(this._cell.X, this._cell.Y, this._cell.Width, this._cell.Width);

                }
            }
        }
    });

    Bridge.define("Minesweeper.CellParams", {
        $kind: "struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new Minesweeper.CellParams(); }
            }
        },
        fields: {
            Row: 0,
            Column: 0,
            Width: 0
        },
        ctors: {
            $ctor1: function (row, column, width) {
                this.$initialize();
                this.Row = row;
                this.Column = column;
                this.Width = width;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            getHashCode: function () {
                var h = Bridge.addHash([3453958656, this.Row, this.Column, this.Width]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, Minesweeper.CellParams)) {
                    return false;
                }
                return Bridge.equals(this.Row, o.Row) && Bridge.equals(this.Column, o.Column) && Bridge.equals(this.Width, o.Width);
            },
            $clone: function (to) { return this; }
        }
    });

    Bridge.define("Minesweeper.Ext", {
        statics: {
            methods: {
                ToDoubleArray: function (array) {
                    var list = System.Array.init(array.length, 0, System.Double);
                    for (var i = 0; i < list.length; i = (i + 1) | 0) {
                        list[System.Array.index(i, list)] = array[System.Array.index(i, array)];
                    }
                    return list;
                },
                ArrayContentString: function (T, array) {
                    var builder = new System.Text.StringBuilder();
                    for (var index = 0; index < array.length; index = (index + 1) | 0) {
                        var x1 = array[System.Array.index(index, array)];
                        builder.append(System.String.concat("{ ", x1) + " }");
                    }
                    return builder.toString();
                }
            }
        }
    });

    Bridge.define("Minesweeper.IMinesweeperBase", {
        $kind: "interface"
    });

    Bridge.define("Minesweeper.IGeneration", {
        $kind: "interface"
    });

    Bridge.define("Minesweeper.INeuralNetwork", {
        inherits: [System.ICloneable],
        $kind: "interface"
    });

    Bridge.define("Minesweeper.IOptimizationFunction", {
        $kind: "interface"
    });

    Bridge.define("Minesweeper.MinesweeperConfig", {
        fields: {
            Rows: null,
            Columns: null,
            CellWidth: null,
            Width: null,
            Height: null,
            Seed: 0,
            BombCount: 0
        },
        ctors: {
            init: function () {
                this.CellWidth = 40;
                this.Width = 600;
                this.Height = 600;
                this.Seed = 100;
                this.BombCount = 20;
            }
        }
    });

    Bridge.define("Minesweeper.MinesweeperGrid", {
        fields: {
            Cells: null,
            Rows: 0,
            Columns: 0,
            Width: 0
        },
        ctors: {
            ctor: function () {
                this.$initialize();

            },
            $ctor1: function (rows, columns, width) {
                this.$initialize();
                this.Rows = rows;
                this.Columns = columns;
                this.Width = width;
                this.Setup();
            }
        },
        methods: {
            GetStringRepresentation: function () {
                var $t, $t1;
                var str = new System.Text.StringBuilder();
                $t = Bridge.getEnumerator(System.Linq.Enumerable.from(this.Cells, Minesweeper.BaseCell).groupBy(function (p) {
                        return p.Row;
                    }).orderBy(function (p) {
                    return p.key();
                }));
                try {
                    while ($t.moveNext()) {
                        var baseCells = $t.Current;
                        $t1 = Bridge.getEnumerator(baseCells);
                        try {
                            while ($t1.moveNext()) {
                                var baseCell = $t1.Current;
                                str.append(baseCell.DisplayValue());
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }
                        str.appendLine();
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                return str.toString();
            },
            SquareCells: function (cell) {
                var cells = new (System.Collections.Generic.List$1(Minesweeper.BaseCell)).ctor();
                for (var i = -1; i < 2; i = (i + 1) | 0) {
                    for (var j = -1; j < 2; j = (j + 1) | 0) {
                        var column = { v : (cell.Column + i) | 0 };
                        var row = { v : (cell.Row + j) | 0 };
                        if (row.v >= 0 && row.v < this.Rows && column.v >= 0 && column.v < this.Columns) {
                            var neighbor = System.Linq.Enumerable.from(this.Cells, Minesweeper.BaseCell).firstOrDefault((function ($me, row, column) {
                                    return function (p) {
                                        return p.Row === row.v && p.Column === column.v;
                                    };
                                })(this, row, column), null);

                            cells.add(neighbor);
                        }
                    }
                }
                return cells.ToArray();
            },
            SetDimensions: function (width, xOffset, yOffset) {
                var $t;
                this.Width = width;
                $t = Bridge.getEnumerator(this.Cells);
                try {
                    while ($t.moveNext()) {
                        var baseCell = $t.Current;
                        baseCell.Width = width;
                        baseCell.XOffset = xOffset;
                        baseCell.YOffset = yOffset;
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            Setup: function () {
                var $t;
                this.Cells = new (System.Collections.Generic.List$1(Minesweeper.BaseCell)).$ctor2(Bridge.Int.mul(this.Rows, this.Columns));
                for (var i = 0; i < this.Rows; i = (i + 1) | 0) {
                    for (var j = 0; j < this.Columns; j = (j + 1) | 0) {
                        var cell = ($t = new Minesweeper.BaseCell(), $t.Row = i, $t.Column = j, $t.Width = this.Width, $t);
                        this.Cells.add(cell);
                    }
                }
            }
        }
    });

    Bridge.define("Minesweeper.NeuralNetworkTest", {
        statics: {
            methods: {
                ListCountAssert: function (assert, neuro) {
                    var $t, $t1;
                    neuro.EvolveGeneration();

                    assert.ok(($t = Minesweeper.INeuralNetwork, System.Linq.Enumerable.from(neuro.NeuralNetworks, $t).toList($t)).Count === 100, Bridge.toString(($t1 = Minesweeper.INeuralNetwork, System.Linq.Enumerable.from(neuro.NeuralNetworks, $t1).toList($t1)).Count));
                }
            }
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                QUnit.test("inputTest", Bridge.fn.cacheBind(this, this.InputTest));
                QUnit.test("hiddenLayerTest", Bridge.fn.cacheBind(this, this.HiddenLayerTest));
                QUnit.test("OutputTest", Bridge.fn.cacheBind(this, this.OutputTest));
                QUnit.test("WeightTest", Bridge.fn.cacheBind(this, this.WeightTest));
                QUnit.test("NeuroEvolutionTest", Bridge.fn.cacheBind(this, this.NeuroEvolution));
                QUnit.test("EvolutionTest", Bridge.fn.cacheBind(this, this.EvolutionTest));
            }
        },
        methods: {
            EvolutionTest: function (assert) {
                var random = new System.Random.$ctor1(100);
                var neuro = new Minesweeper.NeuroEvolution(new Minesweeper.BaseFitnessTest(), 100, function () {
                    return new Minesweeper.NeuralNetwork.$ctor1(random, 1, System.Array.init([2, 4, 2], System.Int32), 2, 0.1);
                }, random);

                for (var i = 0; i < 10; i = (i + 1) | 0) {
                    Minesweeper.NeuralNetworkTest.ListCountAssert(assert, neuro);
                }

            },
            NeuroEvolution: function (assert) {
                var random = new System.Random.$ctor1(100);
                var neuro = new Minesweeper.NeuroEvolution(new Minesweeper.BaseFitnessTest(), 1000, function () {
                    return new Minesweeper.NeuralNetwork.$ctor1(random, 1, System.Array.init([2, 4, 2], System.Int32), 2, 0.1);
                }, random);
                var firstGen = null;
                var bestnet = null;

                firstGen = neuro.EvolveGeneration();
                for (var i = 0; i < 10; i = (i + 1) | 0) {
                    bestnet = neuro.EvolveGeneration().Minesweeper$IGeneration$Best;
                }

                assert.ok(System.Nullable.lt(firstGen.Minesweeper$IGeneration$Best.Minesweeper$INeuralNetwork$Error, (bestnet != null ? bestnet.Minesweeper$INeuralNetwork$Error : null)));



            },
            WeightTest: function (assert) {
                var network = new Minesweeper.NeuralNetwork.$ctor1(new System.Random.$ctor1(123), 3, System.Array.init([1, 2, 3], System.Int32), 3, 0.1);
                assert.ok(network.Weights.length === 4, "weights equals " + network.Weights.length + " and network size is " + (((network.HiddenLayers.length + 2) | 0)));

            },
            OutputTest: function (assert) {
                var $t;
                var network = new Minesweeper.NeuralNetwork.$ctor1(new System.Random.$ctor1(123), 3, System.Array.init([1, 2, 3], System.Int32), 3, 0.1);
                assert.ok(($t = network.feedForward(System.Array.init([1.0, 2, 3], System.Double)))[System.Array.index(0, $t)] !== 0, "Output: " + (Minesweeper.Ext.ArrayContentString(System.Double, network.feedForward(System.Array.init([1.0, 2, 3], System.Double))) || ""));
            },
            HiddenLayerTest: function (assert) {
                var network = new Minesweeper.NeuralNetwork.$ctor1(new System.Random.$ctor1(123), 3, System.Array.init([1, 2, 3], System.Int32), 3, 0.1);
                assert.equal(network.HiddenLayers.length, 3);
            },
            InputTest: function (assert) {
                var network = new Minesweeper.NeuralNetwork.$ctor1(new System.Random.$ctor1(123), 3, System.Array.init([1], System.Int32), 3, 0.1);
                assert.equal(network.Inputs.length, 3);
            }
        }
    });

    Bridge.define("Minesweeper.Program", {
        main: function Main () {
            var game = new Minesweeper.Game();

        }
    });

    Bridge.define("Minesweeper.Theme", {
        statics: {
            fields: {
                HighlightColor: null,
                DefaultFill: null,
                CellColor: null,
                BombColor: null,
                BombBackgroundColor: null,
                EmptyCellColor: null,
                FlagColor: null,
                CellStrokeColor: null,
                FlagFont: null,
                ValueFont: null,
                BombFont: null,
                ClassColor: null
            },
            ctors: {
                init: function () {
                    this.HighlightColor = Minesweeper.Theme.GetColor("HighlightColor");
                    this.DefaultFill = Minesweeper.Theme.GetColor("DefaultFill");
                    this.CellColor = Minesweeper.Theme.GetColor("CellColor");
                    this.BombColor = Minesweeper.Theme.GetColor("BombColor");
                    this.BombBackgroundColor = Minesweeper.Theme.GetColor("BombBackgroundColor");
                    this.EmptyCellColor = Minesweeper.Theme.GetColor("EmptyCellColor");
                    this.FlagColor = Minesweeper.Theme.GetColor("FlagColor");
                    this.CellStrokeColor = Minesweeper.Theme.GetColor("CellStrokeColor");
                    this.FlagFont = Minesweeper.Theme.GetColor("FlagFont", "font");
                    this.ValueFont = Minesweeper.Theme.GetColor("ValueFont", "font");
                    this.BombFont = Minesweeper.Theme.GetColor("BombFont", "font");
                    this.ClassColor = new (System.Collections.Generic.Dictionary$2(System.String,System.String)).ctor();
                }
            },
            methods: {
                GetColor: function (className, prop) {
                    if (prop === void 0) { prop = "color"; }
                    if (Minesweeper.Theme.ClassColor == null) {
                        Minesweeper.Theme.ClassColor = new (System.Collections.Generic.Dictionary$2(System.String,System.String)).ctor();
                    }
                    if (className == null) {
                        throw new System.ArgumentNullException.$ctor1("className");
                    }
                    if (Minesweeper.Theme.ClassColor.containsKey(className)) {
                        return Minesweeper.Theme.ClassColor.getItem(className);
                    }

                    var div = document.createElement("div");
                    div.className = className;
                    document.body.appendChild(div);


                    var style = window.getComputedStyle(div);

                    var color = style.getPropertyValue(prop);

                    Minesweeper.Theme.ClassColor.add(className, color);

                    document.body.removeChild(div);

                    return color;
                }
            }
        }
    });

    Bridge.define("Minesweeper.BaseFitnessTest", {
        inherits: [Minesweeper.IFitnessVal],
        props: {
            Maximize: {
                get: function () {
                    return true;
                }
            }
        },
        alias: [
            "Maximize", "Minesweeper$IFitnessVal$Maximize",
            "EvaluateFitness", "Minesweeper$IFitnessVal$EvaluateFitness"
        ],
        methods: {
            EvaluateFitness: function (network) {
                var $t, $t1, $t2;
                return ($t = network.Minesweeper$INeuralNetwork$feedForward(System.Array.init([($t1 = ($t2 = network.Minesweeper$INeuralNetwork$Weights)[System.Array.index(0, $t2)])[System.Array.index(0, $t1)]], System.Double)))[System.Array.index(0, $t)];
            }
        }
    });

    Bridge.define("Minesweeper.MinesweeperBase", {
        inherits: [Minesweeper.IMinesweeperBase],
        fields: {
            Config: null,
            Grid: null,
            Columns: 0,
            Rows: 0,
            Width: 0,
            Height: 0,
            random: null
        },
        events: {
            HasLost: null,
            HasWon: null,
            GameEnded: null
        },
        props: {
            Cells: {
                get: function () {
                    var $t;
                    return ($t = this.Grid) != null ? $t.Cells : null;
                }
            },
            MaxScore: {
                get: function () {
                    return this.Grid.Cells.Count;
                }
            },
            Score: {
                get: function () {
                    return ((System.Linq.Enumerable.from(this.Grid.Cells, Minesweeper.BaseCell).count(function (p) {
                            return p.Visible;
                        }) - System.Linq.Enumerable.from(this.Grid.Cells, Minesweeper.BaseCell).count(function (p) {
                            return p.Flag;
                        })) | 0);
                }
            },
            HasBombs: {
                get: function () {
                    return System.Linq.Enumerable.from(this.Cells, Minesweeper.BaseCell).count(function (p) {
                            return p.Bomb;
                        }) > 0;
                }
            },
            GameEnd: {
                get: function () {
                    return (this.Win || this.Lost);
                }
            },
            AllFlagged: {
                get: function () {
                    return System.Linq.Enumerable.from(this.Grid.Cells, Minesweeper.BaseCell).where(function (p) {
                            return p.Bomb;
                        }).all(function (p) {
                        return p.Flag;
                    });
                }
            },
            AllVisible: {
                get: function () {
                    return System.Linq.Enumerable.from(this.Grid.Cells, Minesweeper.BaseCell).where(function (p) {
                            return !p.Bomb;
                        }).all(function (p) {
                        return p.Visible;
                    });
                }
            },
            Win: {
                get: function () {
                    return (this.AllFlagged || this.AllVisible) && this.HasBombs;
                }
            },
            Lost: {
                get: function () {
                    return System.Linq.Enumerable.from(this.Grid.Cells, Minesweeper.BaseCell).any(function (p) {
                            return p.Visible && p.Bomb;
                        });
                }
            }
        },
        alias: ["ClickOnCell", "Minesweeper$IMinesweeperBase$ClickOnCell"],
        ctors: {
            ctor: function () {
                this.$initialize();

            }
        },
        methods: {
            ToggleFlagCell: function (item) {
                item.Flag = !item.Flag;
            },
            ShowCell: function (item) {
                var $t;
                if (System.Linq.Enumerable.from(this.Grid.Cells, Minesweeper.BaseCell).any(function (p) {
                        return p.Bomb;
                    }) !== true) {
                    this.SetupBombs(this.Config.BombCount, this.Config.Seed, item);
                }

                if (item.Flag) {
                    this.ToggleFlagCell(item);
                    return;
                }

                item.Visible = true;
                if (item.Bomb) {
                    this.OnHasLost();
                    this.OnGameEnded(false);
                }

                if (item.Value === 0) {
                    this.ShowOthers(item);
                    $t = Bridge.getEnumerator(this.Grid.Cells);
                    try {
                        while ($t.moveNext()) {
                            var gridCell = $t.Current;
                            if (System.Linq.Enumerable.from(this.Grid.SquareCells(gridCell), Minesweeper.BaseCell).any(function (p) {
                                    return p.Value === 0 && p.Bomb !== true && p.Visible;
                                })) {
                                gridCell.Visible = true;
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                }
            },
            ClickOnCell: function (item, placeAsFlag) {
                if (item.Visible) {
                    return false;
                }

                if (!placeAsFlag) {
                    this.ShowCell(item);
                } else {
                    this.ToggleFlagCell(item);
                }
                if (this.Win) {
                    this.OnHasWon();
                    this.OnGameEnded(true);
                }
                return true;
            },
            CalculateBombs: function (cell) {
                var $t;
                var numOfBombs = 0;
                for (var i = -1; i < 2; i = (i + 1) | 0) {
                    for (var j = -1; j < 2; j = (j + 1) | 0) {
                        var column = { v : (cell.Column + i) | 0 };
                        var row = { v : (cell.Row + j) | 0 };
                        if (row.v >= 0 && row.v <= this.Rows && column.v >= 0 && column.v <= this.Columns) {
                            if (System.Nullable.eq((($t = System.Linq.Enumerable.from(this.Grid.Cells, Minesweeper.BaseCell).firstOrDefault((function ($me, row, column) {
                                        return function (p) {
                                            return p.Row === row.v && p.Column === column.v;
                                        };
                                    })(this, row, column), null)) != null ? $t.Bomb : null), true)) {
                                numOfBombs = (numOfBombs + 1) | 0;
                            }
                        }

                    }
                }
                cell.Value = numOfBombs;
            },
            Reset: function () {
                this.Setup(this.Config);
                this.Show();
            },
            ShowOthers: function (cell) {

                for (var i = -1; i < 2; i = (i + 1) | 0) {
                    for (var j = -1; j < 2; j = (j + 1) | 0) {
                        var column = { v : (cell.Column + i) | 0 };
                        var row = { v : (cell.Row + j) | 0 };
                        if (row.v >= 0 && row.v < this.Grid.Rows && column.v >= 0 && column.v < this.Grid.Columns) {
                            var neighbor = System.Linq.Enumerable.from(this.Grid.Cells, Minesweeper.BaseCell).firstOrDefault((function ($me, row, column) {
                                    return function (p) {
                                        return p.Row === row.v && p.Column === column.v;
                                    };
                                })(this, row, column), null);
                            if (System.Nullable.eq((neighbor != null ? neighbor.Value : null), 0) && neighbor.Visible !== true && neighbor.Bomb !== true) {
                                neighbor.Visible = true;
                                this.ShowOthers(neighbor);
                            }
                        }
                    }
                }

            },
            Show: function () {
                var $t;
                $t = Bridge.getEnumerator(this.Grid.Cells);
                try {
                    while ($t.moveNext()) {
                        var item = $t.Current;
                        item.Show();
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

            },
            SetDimensions: function (width, height) {
                this.Config.Width = width;
                this.Config.Height = height;
                var cellWidth = 0;
                var rows;
                var columns;
                if (((rows = Bridge.is(this.Config.Rows, System.Int32) ? System.Nullable.getValue(this.Config.Rows) : null)) != null && ((columns = Bridge.is(this.Config.Columns, System.Int32) ? System.Nullable.getValue(this.Config.Columns) : null)) != null) {
                    cellWidth = Math.min(width, height) / Math.min(rows, columns);
                    this.Grid.SetDimensions(cellWidth, 0, 0);
                }
                return cellWidth;
            },
            Setup: function (config) {
                var $t, $t1, $t2, $t3, $t4;
                this.Config = config;
                var cellwidth = ($t = config.CellWidth, $t != null ? $t : 10);
                this.Width = ($t1 = config.Width, $t1 != null ? $t1 : 100);
                this.Height = ($t2 = config.Height, $t2 != null ? $t2 : 100);
                if (config.Columns != null) {
                    this.Columns = ($t3 = config.Columns, $t3 != null ? $t3 : 0);
                } else {
                    this.Columns = Bridge.Int.clip32(this.Width / cellwidth);
                }

                if (config.Rows != null) {
                    this.Rows = ($t4 = config.Rows, $t4 != null ? $t4 : 0);
                } else {
                    this.Rows = Bridge.Int.clip32(this.Height / cellwidth);
                }

                this.Grid = new Minesweeper.MinesweeperGrid.$ctor1(this.Rows, this.Columns, cellwidth);

            },
            SetupBombs: function (numOfBombs, seed, firstCell) {
                var $t;
                this.random = this.random || new System.Random.$ctor1(seed);
                for (var i = 0; i < numOfBombs; i = (i + 1) | 0) {
                    var cells = System.Linq.Enumerable.from(this.Grid.Cells, Minesweeper.BaseCell).where(function (p) {
                            return p.Bomb !== true && !Bridge.referenceEquals(p, firstCell);
                        }).toList(Minesweeper.BaseCell);
                    cells.getItem(this.random.Next$2(0, ((cells.Count - 1) | 0))).Bomb = true;
                }

                $t = Bridge.getEnumerator(this.Grid.Cells);
                try {
                    while ($t.moveNext()) {
                        var item = $t.Current;
                        if (item.Bomb !== true) {
                            this.CalculateBombs(item);
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            OnHasWon: function () {
                !Bridge.staticEquals(this.HasWon, null) ? this.HasWon(this, { }) : null;
            },
            OnHasLost: function () {
                !Bridge.staticEquals(this.HasLost, null) ? this.HasLost(this, { }) : null;
            },
            OnGameEnded: function (e) {
                !Bridge.staticEquals(this.GameEnded, null) ? this.GameEnded(this, e) : null;
            }
        }
    });

    Bridge.define("Minesweeper.Generation", {
        inherits: [Minesweeper.IGeneration],
        fields: {
            NeuralNetworks: null,
            Best: null,
            Worst: null,
            Average: null,
            GenerationIndex: 0
        },
        alias: [
            "NeuralNetworks", "Minesweeper$IGeneration$NeuralNetworks",
            "Best", "Minesweeper$IGeneration$Best",
            "Worst", "Minesweeper$IGeneration$Worst",
            "Average", "Minesweeper$IGeneration$Average",
            "GenerationIndex", "Minesweeper$IGeneration$GenerationIndex"
        ],
        ctors: {
            ctor: function (neuralNetworks, best, worst, average, generationIndex) {
                this.$initialize();
                this.NeuralNetworks = neuralNetworks;
                this.Best = best;
                this.Worst = worst;
                this.Average = average;
                this.GenerationIndex = generationIndex;
            }
        }
    });

    Bridge.define("Minesweeper.MinesweeperFitnessTest", {
        inherits: [Minesweeper.IFitnessVal],
        props: {
            Maximize: {
                get: function () {
                    return true;
                }
            }
        },
        alias: [
            "Maximize", "Minesweeper$IFitnessVal$Maximize",
            "EvaluateFitness", "Minesweeper$IFitnessVal$EvaluateFitness"
        ],
        methods: {
            EvaluateFitness: function (network) {
                var $t;
                var mine = new Minesweeper.MinesweeperBase();
                mine.Setup(($t = new Minesweeper.MinesweeperConfig(), $t.BombCount = 50, $t));
                var clicks = 0;
                var score = 0;
                while (mine.GameEnd !== true && clicks < mine.MaxScore) {
                    var result = network.Minesweeper$INeuralNetwork$feedForward(Minesweeper.Ext.ToDoubleArray(System.Linq.Enumerable.from(mine.Grid.Cells, Minesweeper.BaseCell).select(function (p) {
                            return p.Value;
                        }).ToArray(System.Int32)));
                    var x = { v : 0 }, y = { v : 0 };
                    x.v = result[System.Array.index(0, result)] * mine.Width;
                    y.v = result[System.Array.index(1, result)] * mine.Width;
                    var cell = System.Linq.Enumerable.from(mine.Grid.Cells, Minesweeper.BaseCell).firstOrDefault((function ($me, x, y) {
                            return function (p) {
                                return p.Hit(Bridge.Int.clip32(x.v), Bridge.Int.clip32(y.v));
                            };
                        })(this, x, y), null);
                    if (cell != null) {
                        var c = mine.ClickOnCell(cell, false);
                        if (c !== true) {
                            score = (score - 1) | 0;
                        }
                    }
                    clicks = (clicks + 1) | 0;

                }

                return ((mine.Score + score) | 0);

            }
        }
    });

    Bridge.define("Minesweeper.NeuralNetwork", {
        inherits: [Minesweeper.INeuralNetwork],
        fields: {
            _random: null,
            Inputs: null,
            HiddenLayers: null,
            Outputs: null,
            Weights: null,
            _bias: 0,
            Error: 0
        },
        alias: [
            "Inputs", "Minesweeper$INeuralNetwork$Inputs",
            "HiddenLayers", "Minesweeper$INeuralNetwork$HiddenLayers",
            "Outputs", "Minesweeper$INeuralNetwork$Outputs",
            "Weights", "Minesweeper$INeuralNetwork$Weights",
            "sigmoid", "Minesweeper$INeuralNetwork$sigmoid",
            "derivative", "Minesweeper$INeuralNetwork$derivative",
            "feedForward", "Minesweeper$INeuralNetwork$feedForward",
            "Error", "Minesweeper$INeuralNetwork$Error",
            "clone", "System$ICloneable$clone"
        ],
        ctors: {
            ctor: function (network) {
                this.$initialize();
                this._bias = network._bias;
                this._random = network._random;
                this.Inputs = Bridge.cast(System.Array.clone(network.Inputs), System.Array.type(System.Double));
                this.Outputs = Bridge.cast(System.Array.clone(network.Outputs), System.Array.type(System.Double));
                this.HiddenLayers = Bridge.cast(System.Array.clone(network.HiddenLayers), System.Array.type(System.Array.type(System.Double)));
                this.Weights = Bridge.cast(System.Array.clone(network.Weights), System.Array.type(System.Array.type(System.Double)));
                this.Error = network.Error;
            },
            $ctor1: function (random, inputs, hiddenlayer, output, bias) {
                var $t;
                this.$initialize();
                this._bias = bias;
                this._random = random;
                this.Inputs = System.Array.init(inputs, 0, System.Double);
                this.Outputs = System.Array.init(output, 0, System.Double);
                this.HiddenLayers = System.Array.init(hiddenlayer.length, null, System.Array.type(System.Double));
                for (var index = 0; index < hiddenlayer.length; index = (index + 1) | 0) {
                    var hi = hiddenlayer[System.Array.index(index, hiddenlayer)];
                    ($t = this.HiddenLayers)[System.Array.index(index, $t)] = System.Array.init(hi, 0, System.Double);
                }
                this.InitWeights();
                this.SetWeights();
            }
        },
        methods: {
            toString: function () {
                return System.String.format("Error: {0}, InputSize: {1}", Bridge.box(this.Error, System.Double, System.Double.format, System.Double.getHashCode), Bridge.box(this.Inputs.length, System.Int32));
            },
            InitWeights: function () {
                var $t, $t1, $t2, $t3, $t4, $t5, $t6;
                this.Weights = System.Array.init(((1 + this.HiddenLayers.length) | 0), null, System.Array.type(System.Double));
                for (var i = 0; i < this.Weights.length; i = (i + 1) | 0) {
                    if (i === 0) {
                        ($t = this.Weights)[System.Array.index(i, $t)] = System.Array.init(Bridge.Int.mul(this.Inputs.length, ($t1 = this.HiddenLayers)[System.Array.index(0, $t1)].length), 0, System.Double);
                    } else if (i === ((this.Weights.length - 1) | 0)) {
                        ($t2 = this.Weights)[System.Array.index(i, $t2)] = System.Array.init(Bridge.Int.mul(this.Outputs.length, ($t3 = this.HiddenLayers)[System.Array.index(((this.HiddenLayers.length - 1) | 0), $t3)].length), 0, System.Double);
                    } else {
                        if (this.HiddenLayers.length > 1) {
                            ($t4 = this.Weights)[System.Array.index(i, $t4)] = System.Array.init(Bridge.Int.mul(($t5 = this.HiddenLayers)[System.Array.index(((i - 1) | 0), $t5)].length, ($t6 = this.HiddenLayers)[System.Array.index(i, $t6)].length), 0, System.Double);

                        }
                    }
                }



            },
            sigmoid: function (x) {
                return 1 / (1 + Math.exp(-x));
            },
            derivative: function (x) {
                var s = this.sigmoid(x);
                return s * (1 - s);
            },
            ResetHiddenLayers: function () {
                var $t, $t1, $t2;
                for (var i = 0; i < this.HiddenLayers.length; i = (i + 1) | 0) {
                    for (var i1 = 0; i1 < ($t = this.HiddenLayers)[System.Array.index(i, $t)].length; i1 = (i1 + 1) | 0) {
                        ($t1 = ($t2 = this.HiddenLayers)[System.Array.index(i, $t2)])[System.Array.index(i1, $t1)] = 0;
                    }
                }
            },
            feedForward: function (input) {
                var $t, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $t8, $t9;
                if (input.length !== this.Inputs.length) {
                    throw new System.Exception("input size must be same size as input layer");
                }
                this.ResetHiddenLayers();
                this.Inputs = input;
                this.CalculateLayer(this.Inputs, ($t = this.HiddenLayers)[System.Array.index(0, $t)], ($t1 = this.Weights)[System.Array.index(0, $t1)]);
                for (var i = 0; i < ($t2 = this.HiddenLayers)[System.Array.index(0, $t2)].length; i = (i + 1) | 0) {
                    ($t3 = ($t4 = this.HiddenLayers)[System.Array.index(0, $t4)])[System.Array.index(i, $t3)] += this._bias;
                }
                for (var i1 = 1; i1 < this.HiddenLayers.length; i1 = (i1 + 1) | 0) {
                    this.CalculateLayer(($t5 = this.HiddenLayers)[System.Array.index(((i1 - 1) | 0), $t5)], ($t6 = this.HiddenLayers)[System.Array.index(i1, $t6)], ($t7 = this.Weights)[System.Array.index(i1, $t7)]);
                }

                this.CalculateLayer(($t8 = this.HiddenLayers)[System.Array.index(((this.HiddenLayers.length - 1) | 0), $t8)], this.Outputs, ($t9 = this.Weights)[System.Array.index(((this.Weights.length - 1) | 0), $t9)]);
                return this.Outputs;
            },
            CalculateLayer: function (firstLayer, secondLayer, weights) {
                var weightindex = 0;
                for (var i = 0; i < firstLayer.length; i = (i + 1) | 0) {
                    for (var i1 = 0; i1 < secondLayer.length; i1 = (i1 + 1) | 0) {
                        var weight = weights[System.Array.index(weightindex, weights)];
                        var value = firstLayer[System.Array.index(i, firstLayer)] * weight;
                        secondLayer[System.Array.index(i1, secondLayer)] += value;
                        weightindex = (weightindex + 1) | 0;
                    }
                }
                for (var i2 = 0; i2 < secondLayer.length; i2 = (i2 + 1) | 0) {
                    secondLayer[System.Array.index(i2, secondLayer)] = this.sigmoid(secondLayer[System.Array.index(i2, secondLayer)]);
                }
            },
            SetWeights: function () {
                var $t, $t1, $t2;
                for (var i = 0; i < this.Weights.length; i = (i + 1) | 0) {
                    for (var i1 = 0; i1 < ($t = this.Weights)[System.Array.index(i, $t)].length; i1 = (i1 + 1) | 0) {
                        ($t1 = ($t2 = this.Weights)[System.Array.index(i, $t2)])[System.Array.index(i1, $t1)] = this._random.NextDouble() * 2 - 1;
                    }
                }
            },
            clone: function () {
                return new Minesweeper.NeuralNetwork.ctor(this);
            }
        }
    });

    Bridge.define("Minesweeper.NeuroBackPropagation", {
        inherits: [Minesweeper.IOptimizationFunction],
        fields: {
            _network: null,
            _steps: 0,
            FitnessVal: null,
            Generation: 0
        },
        alias: [
            "FitnessVal", "Minesweeper$IOptimizationFunction$FitnessVal",
            "Generation", "Minesweeper$IOptimizationFunction$Generation",
            "EvolveGeneration", "Minesweeper$IOptimizationFunction$EvolveGeneration",
            "Evolve", "Minesweeper$IOptimizationFunction$Evolve"
        ],
        ctors: {
            ctor: function (network, steps) {
                this.$initialize();
                this._network = network;
                this._steps = steps;
            }
        },
        methods: {
            PartialDerivativeOutput: function (output, target) {
                return (target - output);
            },
            Error: function (output, target) {
                return (0.5) * Math.pow(target - output, 2);
            },
            FeedForward: function (input, prediction) {
                var result = this._network.Minesweeper$INeuralNetwork$feedForward(input);
                var totalError = 0.0;
                for (var i = 0; i < result.length; i = (i + 1) | 0) {
                    totalError += this.Error(result[System.Array.index(i, result)], prediction[System.Array.index(i, prediction)]);
                }
            },
            EvolveGeneration: function () {
                throw new System.NotImplementedException.ctor();
            },
            Evolve: function (error) {
                throw new System.NotImplementedException.ctor();
            }
        }
    });

    Bridge.define("Minesweeper.NeuroEvolution", {
        inherits: [Minesweeper.IOptimizationFunction],
        fields: {
            _speciesCount: 0,
            _random: null,
            FitnessVal: null,
            Generation: 0,
            NeuralNetworks: null
        },
        events: {
            GenerationFinished: null
        },
        alias: [
            "FitnessVal", "Minesweeper$IOptimizationFunction$FitnessVal",
            "Generation", "Minesweeper$IOptimizationFunction$Generation",
            "EvolveGeneration", "Minesweeper$IOptimizationFunction$EvolveGeneration",
            "Evolve", "Minesweeper$IOptimizationFunction$Evolve"
        ],
        ctors: {
            ctor: function (fitnessVal, speciesCount, neuralFunc, random) {
                this.$initialize();
                this.Generation = 1;
                this._speciesCount = speciesCount;
                this._random = random;
                this.FitnessVal = fitnessVal;
                var list = new (System.Collections.Generic.List$1(Minesweeper.INeuralNetwork)).ctor();
                for (var i = 0; i < speciesCount; i = (i + 1) | 0) {
                    list.add(neuralFunc());
                }

                this.NeuralNetworks = list;
            }
        },
        methods: {
            Mutate: function (network) {
                var $t, $t1, $t2, $t3, $t4;
                for (var i = 0; i < network.Minesweeper$INeuralNetwork$Weights.length; i = (i + 1) | 0) {
                    for (var i1 = 0; i1 < ($t = network.Minesweeper$INeuralNetwork$Weights)[System.Array.index(i, $t)].length; i1 = (i1 + 1) | 0) {
                        var weights = network.Minesweeper$INeuralNetwork$Weights;
                        var option = this._random.Next$2(0, 100);
                        if (option >= 10 && option < 50) {
                            ($t1 = weights[System.Array.index(i, weights)])[System.Array.index(i1, $t1)] *= this._random.NextDouble() * 2 - 1;
                        } else if (option < 10) {
                            ($t2 = weights[System.Array.index(i, weights)])[System.Array.index(i1, $t2)] = this._random.NextDouble() * 2 - 1;
                        } else if (option >= 80) {
                            ($t3 = weights[System.Array.index(i, weights)])[System.Array.index(i1, $t3)] = -($t4 = weights[System.Array.index(i, weights)])[System.Array.index(i1, $t4)];
                        }
                    }
                }
            },
            EvolveGeneration: function () {
                var $t, $t1, $t2;
                $t = Bridge.getEnumerator(this.NeuralNetworks, Minesweeper.INeuralNetwork);
                try {
                    while ($t.moveNext()) {
                        var neuralNetwork = $t.Current;
                        var fitness = this.FitnessVal.Minesweeper$IFitnessVal$EvaluateFitness(neuralNetwork);
                        neuralNetwork.Minesweeper$INeuralNetwork$Error = fitness;
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                var orderedNetworks = { v : this.FitnessVal.Minesweeper$IFitnessVal$Maximize ? System.Linq.Enumerable.from(this.NeuralNetworks, Minesweeper.INeuralNetwork).orderByDescending(function (p) {
                        return p.Minesweeper$INeuralNetwork$Error;
                    }).ToArray(Minesweeper.INeuralNetwork) : System.Linq.Enumerable.from(this.NeuralNetworks, Minesweeper.INeuralNetwork).orderBy(function (p) {
                        return p.Minesweeper$INeuralNetwork$Error;
                    }).ToArray(Minesweeper.INeuralNetwork) };

                var gen = new Minesweeper.Generation(orderedNetworks.v, orderedNetworks.v[System.Array.index(0, orderedNetworks.v)], orderedNetworks.v[System.Array.index(((orderedNetworks.v.length - 1) | 0), orderedNetworks.v)], orderedNetworks.v[System.Array.index(((Bridge.Int.div((((orderedNetworks.v.length - 1) | 0)), 2)) | 0), orderedNetworks.v)], this.Generation);
                this.Breed(orderedNetworks);
                var r = ($t1 = Minesweeper.INeuralNetwork, System.Linq.Enumerable.from(orderedNetworks.v, $t1).toList($t1));
                r.Reverse();
                var reverse = System.Linq.Enumerable.from(r, Minesweeper.INeuralNetwork).take(Bridge.Int.clip32(orderedNetworks.v.length - orderedNetworks.v.length * 0.1));
                $t2 = Bridge.getEnumerator(reverse);
                try {
                    while ($t2.moveNext()) {
                        var neuralNetwork1 = $t2.Current;
                        this.Mutate(neuralNetwork1);
                    }
                } finally {
                    if (Bridge.is($t2, System.IDisposable)) {
                        $t2.System$IDisposable$Dispose();
                    }
                }

                this.OnGenerationFinished(gen);

                this.Generation = (this.Generation + 1) | 0;
                return gen;
            },
            Breed: function (orderedNetworks) {
                var top = System.Linq.Enumerable.from(orderedNetworks.v, Minesweeper.INeuralNetwork).take(((Bridge.Int.div((((orderedNetworks.v.length - 1) | 0)), 2)) | 0)).ToArray(Minesweeper.INeuralNetwork);
                var newnetwork = new (System.Collections.Generic.List$1(Minesweeper.INeuralNetwork)).ctor();
                for (var i = 0; i < this._speciesCount; i = (i + 1) | 0) {
                    var index = i % (((top.length - 1) | 0));
                    if (index < top.length) {
                        newnetwork.add(Bridge.cast(Bridge.clone(top[System.Array.index(index, top)]), Minesweeper.INeuralNetwork));
                    }
                }
                this.NeuralNetworks = newnetwork;
                orderedNetworks.v = this.FitnessVal.Minesweeper$IFitnessVal$Maximize ? System.Linq.Enumerable.from(this.NeuralNetworks, Minesweeper.INeuralNetwork).orderByDescending(function (p) {
                        return p.Minesweeper$INeuralNetwork$Error;
                    }).ToArray(Minesweeper.INeuralNetwork) : System.Linq.Enumerable.from(this.NeuralNetworks, Minesweeper.INeuralNetwork).orderBy(function (p) {
                        return p.Minesweeper$INeuralNetwork$Error;
                    }).ToArray(Minesweeper.INeuralNetwork);
            },
            Evolve: function (error) {
                var currentBest = 0.0;
                if (this.FitnessVal.Minesweeper$IFitnessVal$Maximize) {
                    while (true) {
                        var gen = this.EvolveGeneration();
                        currentBest = gen.Minesweeper$IGeneration$Best.Minesweeper$INeuralNetwork$Error;
                        if (error <= currentBest) {
                            return gen.Minesweeper$IGeneration$Best;
                        }
                    }

                } else {
                    while (true) {
                        var gen1 = this.EvolveGeneration();
                        currentBest = gen1.Minesweeper$IGeneration$Best.Minesweeper$INeuralNetwork$Error;

                        if (error >= currentBest) {
                            return gen1.Minesweeper$IGeneration$Best;
                        }
                    }
                }
            },
            OnGenerationFinished: function (e) {
                !Bridge.staticEquals(this.GenerationFinished, null) ? this.GenerationFinished(this, e) : null;
            }
        }
    });

    Bridge.define("Minesweeper.NoShowCell", {
        inherits: [Minesweeper.BaseCell],
        ctors: {
            ctor: function () {
                this.$initialize();
                Minesweeper.BaseCell.ctor.call(this);

            },
            $ctor1: function (row, column, width) {
                this.$initialize();
                Minesweeper.BaseCell.ctor.call(this);
                this.Row = row;
                this.Column = column;
                this.Width = width;
                this.Visible = false;

            }
        }
    });

    Bridge.define("Minesweeper.Game", {
        inherits: [Minesweeper.MinesweeperBase],
        fields: {
            random$1: null,
            Canvas: null,
            _flag: false,
            boardId: null
        },
        props: {
            Result: {
                get: function () {
                    return document.getElementById("result");
                }
            }
        },
        ctors: {
            init: function () {
                this.random$1 = new System.Random.ctor();
                this.boardId = "board";
            },
            ctor: function () {
                this.$initialize();
                Minesweeper.MinesweeperBase.ctor.call(this);
                this.addGameEnded(Bridge.fn.bind(this, function (sender, b) {
                    var result = this.Result;
                    if (b) {
                        result.textContent = "Congrats, you won!";
                    } else {
                        result.textContent = "Uh oh, you hit a bomb!";
                    }
                }));
                this.GameSetup();
                this.SetupHtml();
                this.Show();
            }
        },
        methods: {
            GetY: function (y) {
                return y - this.Canvas.getBoundingClientRect().top;
            },
            GetX: function (x) {
                return x - this.Canvas.getBoundingClientRect().left;
            },
            SetupCanvas: function (canvas, score) {
                var context = canvas.getContext("2d");
                context.canvas.onmousemove = Bridge.fn.bind(this, function (mevent) {
                    var $t;
                    $t = Bridge.getEnumerator(this.Grid.Cells);
                    try {
                        while ($t.moveNext()) {
                            var cell = $t.Current;
                            if (cell.Hit(this.GetX(mevent.clientX), this.GetY(mevent.clientY))) {
                                cell.Highlight();
                            } else {
                                cell.UnHighLight();
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    this.Show();
                });



                context.canvas.onmousedown = Bridge.fn.bind(this, function (mevent) {
                    if (mevent.button === 0) {
                        this.ClickAction(score, context, mevent.clientX, mevent.clientY, this._flag);
                    }
                    if (mevent.button === 2) {
                        this.ClickAction(score, context, mevent.clientX, mevent.clientY, true);
                    }
                });

                context.canvas.oncontextmenu = function (eventt) {
                    eventt.preventDefault();
                };

            },
            ClickAction: function (score, context, x, y, flag) {
                var $t;
                context.clearRect(0, 0, this.Width, this.Height);
                $t = Bridge.getEnumerator(this.Grid.Cells);
                try {
                    while ($t.moveNext()) {
                        var item = $t.Current;
                        if (item.Hit(this.GetX(x), this.GetY(y))) {
                            this.ClickOnCell(item, flag);
                            score.innerHTML = "Score: " + this.Score;
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                this.Show();
            },
            GameSetup: function () {
                var $t;
                this.Setup(($t = new Minesweeper.MinesweeperConfig(), $t.Seed = this.random$1.Next(), $t));
                this.Grid.Cells.ForEach(Bridge.fn.bind(this, function (p) {
                    new Minesweeper.Cell(p, document.getElementById(this.boardId));
                }));
            },
            SetupHtml: function () {



                var gameId = "game";
                var scoreId = "score";

                var canvas = Bridge.cast(document.getElementById(this.boardId), HTMLCanvasElement);
                this.Canvas = canvas;
                var score = document.getElementById(scoreId);
                score.innerHTML = "Score: ";

                this.SetupCanvas(canvas, score);


                var reset = document.getElementById("reset");
                var flag = document.getElementById("flag");
                var text = document.getElementById("flagtext");
                flag.onclick = Bridge.fn.bind(this, function (click) {
                    this._flag = !this._flag;
                    text.innerHTML = "Flag: " + System.Boolean.toString(this._flag);
                });
                reset.onclick = Bridge.fn.bind(this, function (click) {
                    this.GameSetup();
                    this.Show();
                    this.Result.textContent = "";
                });
                canvas.width = Bridge.Int.clip32(this.Width);
                canvas.height = Bridge.Int.clip32(this.Height);

            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJNaW5lc3dlZXBlci5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQmFzZUNlbGwuY3MiLCJDZWxsLmNzIiwiTWluZXN3ZWVwZXJCYXNlLmNzIiwiRXh0LmNzIiwiR3JpZC5jcyIsIkFJL05ldXJhbE5ldHdvcmtUZXN0LmNzIiwiUHJvZ3JhbS5jcyIsIkFJL05ldXJhbE5ldHdvcmsuY3MiLCJBSS9HZW5lcmF0aW9uLmNzIiwiQUkvTmV1cm9Fdm9sdXRpb24uY3MiLCJHYW1lLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkEyQlFBLE9BQU9BLGdCQUFXQTs7Ozs7b0JBTWxCQSxPQUFPQSxnQkFBV0E7Ozs7O29CQU1sQkEsT0FBT0EsZ0JBQVdBLG1CQUFjQSxDQUFDQTs7Ozs7b0JBTWpDQSxPQUFPQSxDQUFDQSxnQkFBV0E7Ozs7O29CQWVUQSxPQUFPQTs7O29CQUdUQSxhQUFRQTtvQkFDUkE7b0JBQ0FBOzs7OztvQkFNRUEsT0FBT0E7OztvQkFHVEEsY0FBU0E7b0JBQ1RBO29CQUNBQTs7Ozs7b0JBT0VBLE9BQU9BOzs7b0JBR1RBLGFBQVFBO29CQUNSQTtvQkFDQUE7Ozs7O29CQU9FQSxPQUFPQTs7O29CQUdUQSxnQkFBV0E7b0JBQ1hBO29CQUNBQTs7Ozs7b0JBY1JBLE9BQU9BLGNBQVNBLGFBQVFBOzs7OztvQkFNeEJBLE9BQU9BLFdBQU1BLGFBQVFBOzs7Ozs7Ozs7Z0JBekdqQkE7Ozs7O2dCQUlBQSx3Q0FBY0EsUUFBS0EsQUFBcUNBLGtCQUFvQkEsTUFBTUEsT0FBa0JBOzs7Z0JBOEJwR0E7Z0JBQ0FBOzs7Z0JBS0FBO2dCQUNBQTs7MkJBbUVvQkEsR0FBU0E7Z0JBRTdCQSxPQUFPQSxDQUFDQSxJQUFJQSxVQUFLQSxJQUFJQSxTQUFJQSxjQUFTQSxJQUFJQSxVQUFLQSxJQUFJQSxTQUFJQTs7O2dCQVFuREEsSUFBSUE7b0JBRUFBOztnQkFF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QUE7Ozs7Ozs7OztvQkFJUkE7Ozs7O2dCQUtKQSw2QkFBNkJBO29CQUV6QkEsSUFBSUE7d0JBRUFBLGlCQUFZQSxPQUFPQSxTQUFTQSxnQkFBZ0JBLGdCQUFnQkE7O29CQUVoRUEsSUFBSUE7d0JBRUFBLGlCQUFZQSxPQUFPQSxTQUFTQSxnQkFBZ0JBOzs7O2dCQUlwREEsK0JBQStCQTtvQkFFM0JBOzs7O21DQUtpQkEsT0FBbUJBLFNBQWtDQSxHQUFTQSxHQUFTQTs7Z0JBRTVGQSx3QkFBd0JBLEFBQU1BLFlBQU9BLEFBQU1BO2dCQUMzQ0EsMEJBQXFCQTs7Ozt3QkFFakJBLElBQUlBLFNBQVNBLFVBQUtBLElBQUlBLFVBQUtBOzRCQUV2QkEsaUJBQVlBLE1BQU1BOzRCQUNsQkEsa0JBQWtCQSxZQUFZQTs7Ozs7Ozs7O2dCQUl0Q0E7Ozs7Z0JBU0FBLFdBQU1BLFVBQUlBLDJDQUE2QkE7Z0JBQ3ZDQSx3QkFBbUJBLEFBQW1CQTtvQkFBS0EsSUFBSUEsaUJBQUtBLEdBQUdBLHdCQUEyQ0E7Ozs7Ozs7Z0JBU2xHQTtnQkFDQUE7O2dCQUVBQSxhQUEyQkEsWUFBb0JBLHdCQUF3QkE7Z0JBQ3ZFQSxjQUFTQTtnQkFDVEEsWUFBWUEsd0JBQXdCQTtnQkFDcENBOztnQkFFQUEsaUJBQVlBLFFBQVFBOzs7Z0JBR3BCQSxZQUFZQTtnQkFDWkEsV0FBV0E7Z0JBQ1hBLFdBQVdBO2dCQUNYQSxlQUFlQTtvQkFFWEEsYUFBUUEsQ0FBQ0E7b0JBQ1RBLGlCQUFpQkEsbUNBQVdBOztnQkFFaENBLGdCQUFnQkE7b0JBRVpBO29CQUNBQTtvQkFDQUE7O2dCQUVKQSxlQUFlQSxrQkFBS0E7Z0JBQ3BCQSxnQkFBZ0JBLGtCQUFLQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db21wb25lbnRNb2RlbDtcclxudXNpbmcgU3lzdGVtLlJ1bnRpbWUuQ29tcGlsZXJTZXJ2aWNlcztcclxuXHJcbm5hbWVzcGFjZSBNaW5lc3dlZXBlclxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQmFzZUNlbGwgOiBJTm90aWZ5UHJvcGVydHlDaGFuZ2VkXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBib29sIF9mbGFnO1xyXG4gICAgICAgIHByaXZhdGUgaW50IF92YWx1ZTtcclxuICAgICAgICBwcml2YXRlIGJvb2wgX2JvbWI7XHJcbiAgICAgICAgcHJpdmF0ZSBib29sIF92aXNpYmxlO1xyXG5cclxuICAgICAgICBwdWJsaWMgQmFzZUNlbGwoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIFNob3coKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVmlzdWFsQ2hhbmdlIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5WaXN1YWxDaGFuZ2UuSW52b2tlKHRoaXMsIEV2ZW50QXJncy5FbXB0eSkpOm51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyIFZpc3VhbENoYW5nZTtcclxucHVibGljIGJvb2wgU2hvd0JvbWJcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFZpc2libGUgJiYgQm9tYjtcclxuICAgIH1cclxufXB1YmxpYyBib29sIFNob3dWYWx1ZVxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gVmlzaWJsZSAmJiBWYWx1ZSA+IDA7XHJcbiAgICB9XHJcbn1wdWJsaWMgYm9vbCBTaG93RW1wdHlcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFZpc2libGUgJiYgVmFsdWUgPD0gMCAmJiAhQm9tYjtcclxuICAgIH1cclxufXB1YmxpYyBib29sIFNob3dGbGFnXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAhVmlzaWJsZSAmJiBGbGFnO1xyXG4gICAgfVxyXG59ICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIEhpZ2hsaWdodCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBJc0hpZ2hsaWdodGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgU2hvdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBVbkhpZ2hMaWdodCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBJc0hpZ2hsaWdodGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFNob3coKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgYm9vbCBGbGFnXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXQgeyByZXR1cm4gX2ZsYWc7IH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9mbGFnID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBPblByb3BlcnR5Q2hhbmdlZCgpO1xyXG4gICAgICAgICAgICAgICAgU2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCBpbnQgVmFsdWVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldCB7IHJldHVybiBfdmFsdWU7IH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF92YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgT25Qcm9wZXJ0eUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgICAgIFNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIGJvb2wgQm9tYlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0IHsgcmV0dXJuIF9ib21iOyB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfYm9tYiA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgT25Qcm9wZXJ0eUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgICAgIFNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIGJvb2wgVmlzaWJsZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0IHsgcmV0dXJuIF92aXNpYmxlOyB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfdmlzaWJsZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgT25Qcm9wZXJ0eUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgICAgIFNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgYm9vbCBJc0hpZ2hsaWdodGVkIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCBpbnQgUm93IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCBpbnQgQ29sdW1uIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgZmxvYXQgWE9mZnNldCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgZmxvYXQgWU9mZnNldCB7IGdldDsgc2V0OyB9XHJcbnB1YmxpYyB2aXJ0dWFsIGZsb2F0IFhcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIENvbHVtbiAqIFdpZHRoICsgWE9mZnNldDtcclxuICAgIH1cclxufXB1YmxpYyB2aXJ0dWFsIGZsb2F0IFlcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFJvdyAqIFdpZHRoICsgWU9mZnNldDtcclxuICAgIH1cclxufSAgICAgICAgcHVibGljIHZpcnR1YWwgZmxvYXQgV2lkdGggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIGJvb2wgSGl0KGZsb2F0IHgsIGZsb2F0IHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gKHggPiBYICYmIHggPCBYICsgV2lkdGggJiYgeSA+IFkgJiYgeSA8IFkgKyBXaWR0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZXZlbnQgUHJvcGVydHlDaGFuZ2VkRXZlbnRIYW5kbGVyIFByb3BlcnR5Q2hhbmdlZDtcclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgRGlzcGxheVZhbHVlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChTaG93Qm9tYilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiWFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChTaG93RW1wdHkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIjBcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoU2hvd0ZsYWcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIkZcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoU2hvd1ZhbHVlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVmFsdWUuVG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gXCIgXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvU3RyaW5nKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiKHswfSx7MX0pOiB7Mn0sVmFsdWU6ezN9LEJvbWI6ezR9XCIsQ29sdW1uLFJvdywoU2hvd0JvbWIgPyBcInhcIiA6IFNob3dFbXB0eSA/IFwiX1wiIDogU2hvd0ZsYWcgPyBcIkZcIiA6IFNob3dWYWx1ZSA/IFZhbHVlLlRvU3RyaW5nKCkgOiBcIlwiKSxWYWx1ZSxCb21iKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCB2aXJ0dWFsIHZvaWQgT25Qcm9wZXJ0eUNoYW5nZWQoW0NhbGxlck1lbWJlck5hbWVdIHN0cmluZyBwcm9wZXJ0eU5hbWUgPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUHJvcGVydHlDaGFuZ2VkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5Qcm9wZXJ0eUNoYW5nZWQuSW52b2tlKHRoaXMsIG5ldyBQcm9wZXJ0eUNoYW5nZWRFdmVudEFyZ3MocHJvcGVydHlOYW1lKSkpOm51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgdmlydHVhbCB2b2lkIE9uVmlzdWFsQ2hhbmdlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFZpc3VhbENoYW5nZSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+VmlzdWFsQ2hhbmdlLkludm9rZSh0aGlzLCBFdmVudEFyZ3MuRW1wdHkpKTpudWxsO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIE1pbmVzd2VlcGVyXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUaGVtZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nIEhpZ2hsaWdodENvbG9yID0gR2V0Q29sb3IoXCJIaWdobGlnaHRDb2xvclwiKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHN0cmluZyBEZWZhdWx0RmlsbCA9IEdldENvbG9yKFwiRGVmYXVsdEZpbGxcIik7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgQ2VsbENvbG9yID0gR2V0Q29sb3IoXCJDZWxsQ29sb3JcIik7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgQm9tYkNvbG9yID0gR2V0Q29sb3IoXCJCb21iQ29sb3JcIik7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgQm9tYkJhY2tncm91bmRDb2xvciA9IEdldENvbG9yKFwiQm9tYkJhY2tncm91bmRDb2xvclwiKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHN0cmluZyBFbXB0eUNlbGxDb2xvciA9IEdldENvbG9yKFwiRW1wdHlDZWxsQ29sb3JcIik7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgRmxhZ0NvbG9yID0gR2V0Q29sb3IoXCJGbGFnQ29sb3JcIik7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgQ2VsbFN0cm9rZUNvbG9yID0gR2V0Q29sb3IoXCJDZWxsU3Ryb2tlQ29sb3JcIik7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nIEZsYWdGb250ID0gR2V0Q29sb3IoXCJGbGFnRm9udFwiLFwiZm9udFwiKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHN0cmluZyBWYWx1ZUZvbnQgPSBHZXRDb2xvcihcIlZhbHVlRm9udFwiLFwiZm9udFwiKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHN0cmluZyBCb21iRm9udCA9IEdldENvbG9yKFwiQm9tYkZvbnRcIiwgXCJmb250XCIpO1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBEaWN0aW9uYXJ5PHN0cmluZywgc3RyaW5nPiBDbGFzc0NvbG9yID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBzdHJpbmc+KCk7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc3RyaW5nIEdldENvbG9yKHN0cmluZyBjbGFzc05hbWUsIHN0cmluZyBwcm9wID0gXCJjb2xvclwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoQ2xhc3NDb2xvciA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgQ2xhc3NDb2xvciA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgc3RyaW5nPigpO1xyXG4gICAgICAgICAgICBpZihjbGFzc05hbWUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJjbGFzc05hbWVcIik7XHJcbiAgICAgICAgICAgIGlmIChDbGFzc0NvbG9yLkNvbnRhaW5zS2V5KGNsYXNzTmFtZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQ2xhc3NDb2xvcltjbGFzc05hbWVdO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCgpO1xyXG4gICAgICAgICAgICBkaXYuQ2xhc3NOYW1lID0gY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKGRpdik7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIHN0eWxlID0gV2luZG93LkdldENvbXB1dGVkU3R5bGUoZGl2KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb2xvciA9IHN0eWxlLkdldFByb3BlcnR5VmFsdWUocHJvcCk7XHJcblxyXG4gICAgICAgICAgICBDbGFzc0NvbG9yLkFkZChjbGFzc05hbWUsIGNvbG9yKTtcclxuXHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuUmVtb3ZlQ2hpbGQoZGl2KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb2xvcjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIGNsYXNzIENlbGwgXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBCYXNlQ2VsbCBfY2VsbDtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEhpZ2hsaWdodCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IF9jYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuRmlsbFN0eWxlID0gVGhlbWUuSGlnaGxpZ2h0Q29sb3I7XHJcbiAgICAgICAgICAgIGNvbnRleHQuRmlsbFJlY3QoKGludClfY2VsbC5YLCAoaW50KV9jZWxsLlksIChpbnQpX2NlbGwuV2lkdGgsIChpbnQpX2NlbGwuV2lkdGgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LkZpbGxTdHlsZSA9IFRoZW1lLkRlZmF1bHRGaWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgVW5IaWdoTGlnaHQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBfY2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBjb250ZXh0LkZpbGxTdHlsZSA9IFRoZW1lLkNlbGxDb2xvcjtcclxuICAgICAgICAgICAgY29udGV4dC5GaWxsUmVjdCgoaW50KV9jZWxsLlgsIChpbnQpX2NlbGwuWSwgKGludClfY2VsbC5XaWR0aCwgKGludClfY2VsbC5XaWR0aCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuRmlsbFN0eWxlID0gVGhlbWUuRGVmYXVsdEZpbGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBDZWxsKEJhc2VDZWxsIGNlbGwsIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9jZWxsID0gY2VsbDtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICAgICAgX2NlbGwuVmlzdWFsQ2hhbmdlICs9IChzZW5kZXIsIGFyZ3MpID0+IFNob3coKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTaG93KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gX2NhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChfY2VsbC5Jc0hpZ2hsaWdodGVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIaWdobGlnaHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFVuSGlnaExpZ2h0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnRleHQuQ2xlYXJSZWN0KFgsWSxXLFcpO1xyXG4gICAgICAgICAgICBpZiAoX2NlbGwuU2hvd0JvbWIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuRmlsbFN0eWxlID0gVGhlbWUuQm9tYkJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuRmlsbFJlY3QoKGludClfY2VsbC5YLCAoaW50KV9jZWxsLlksIChpbnQpX2NlbGwuV2lkdGgsIChpbnQpX2NlbGwuV2lkdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnRleHQuRmlsbFN0eWxlID0gVGhlbWUuQm9tYkNvbG9yO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5Gb250ID0gVGhlbWUuQm9tYkZvbnQ7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LkZpbGxUZXh0KFwiWFwiLCAoaW50KV9jZWxsLlgsIChpbnQpKF9jZWxsLlkgKyBfY2VsbC5XaWR0aCksIChpbnQpX2NlbGwuV2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5GaWxsU3R5bGUgPSBUaGVtZS5EZWZhdWx0RmlsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChfY2VsbC5TaG93VmFsdWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuRm9udCA9IFRoZW1lLlZhbHVlRm9udDtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuRmlsbFRleHQoX2NlbGwuVmFsdWUuVG9TdHJpbmcoKSwgKGludCkoX2NlbGwuWCArIF9jZWxsLldpZHRoIC8gMiksIChpbnQpKF9jZWxsLlkgKyBfY2VsbC5XaWR0aCAvIDIpLCAoaW50KV9jZWxsLldpZHRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChfY2VsbC5TaG93RW1wdHkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuRmlsbFN0eWxlID0gVGhlbWUuRW1wdHlDZWxsQ29sb3I7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LkZpbGxSZWN0KChpbnQpX2NlbGwuWCwgKGludClfY2VsbC5ZLCAoaW50KV9jZWxsLldpZHRoLCAoaW50KV9jZWxsLldpZHRoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuRmlsbFN0eWxlID0gVGhlbWUuRGVmYXVsdEZpbGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKF9jZWxsLlNob3dGbGFnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LkZpbGxTdHlsZSA9IFRoZW1lLkZsYWdDb2xvcjtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuRm9udCA9IFRoZW1lLkZsYWdGb250O1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5GaWxsVGV4dChcIkZcIiwgKGludClfY2VsbC5YLCAoaW50KShfY2VsbC5ZICsgX2NlbGwuV2lkdGgpLCAoaW50KV9jZWxsLldpZHRoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuRmlsbFN0eWxlID0gVGhlbWUuRGVmYXVsdEZpbGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LlN0cm9rZVN0eWxlID0gVGhlbWUuQ2VsbFN0cm9rZUNvbG9yO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5TdHJva2VSZWN0KChpbnQpX2NlbGwuWCwgKGludClfY2VsbC5ZLCAoaW50KV9jZWxsLldpZHRoLCAoaW50KV9jZWxsLldpZHRoKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgfVxyXG59IiwiI2lmICFCcmlkZ2VcclxuICAgICAgdXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG4jZW5kaWZcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkRpYWdub3N0aWNzO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxuXHJcbm5hbWVzcGFjZSBNaW5lc3dlZXBlclxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTm9TaG93Q2VsbCA6IEJhc2VDZWxsXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIE5vU2hvd0NlbGwoKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBOb1Nob3dDZWxsKGludCByb3csIGludCBjb2x1bW4sIGludCB3aWR0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJvdyA9IHJvdztcclxuICAgICAgICAgICAgQ29sdW1uID0gY29sdW1uO1xyXG4gICAgICAgICAgICBXaWR0aCA9IHdpZHRoO1xyXG4gICAgICAgICAgICBWaXNpYmxlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyBNaW5lc3dlZXBlckZpdG5lc3NUZXN0IDogSUZpdG5lc3NWYWxcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYm9vbCBNYXhpbWl6ZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0IHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgRXZhbHVhdGVGaXRuZXNzKElOZXVyYWxOZXR3b3JrIG5ldHdvcmspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbWluZSA9IG5ldyBNaW5lc3dlZXBlckJhc2UoKTtcclxuICAgICAgICAgICAgbWluZS5TZXR1cChuZXcgTWluZXN3ZWVwZXJDb25maWcoKSB7IEJvbWJDb3VudCA9IDUwIH0pO1xyXG4gICAgICAgICAgICBpbnQgY2xpY2tzID0gMDtcclxuICAgICAgICAgICAgaW50IHNjb3JlID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKG1pbmUuR2FtZUVuZCAhPSB0cnVlICYmIGNsaWNrcyA8IG1pbmUuTWF4U2NvcmUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXR3b3JrLkZlZWRGb3J3YXJkKFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PEJhc2VDZWxsLGludD4obWluZS5HcmlkLkNlbGxzLChGdW5jPEJhc2VDZWxsLGludD4pKHAgPT4gcC5WYWx1ZSkpLlRvQXJyYXkoKS5Ub0RvdWJsZUFycmF5KCkpO1xyXG4gICAgICAgICAgICAgICAgZG91YmxlIHggPSAwLCB5ID0gMDtcclxuICAgICAgICAgICAgICAgIHggPSByZXN1bHRbMF0gKiBtaW5lLldpZHRoO1xyXG4gICAgICAgICAgICAgICAgeSA9IHJlc3VsdFsxXSAqIG1pbmUuV2lkdGg7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuRmlyc3RPckRlZmF1bHQ8QmFzZUNlbGw+KG1pbmUuR3JpZC5DZWxscywoRnVuYzxCYXNlQ2VsbCxib29sPikocCA9PiBwLkhpdCgoaW50KXgsIChpbnQpeSkpKTtcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSBtaW5lLkNsaWNrT25DZWxsKGNlbGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYyAhPSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmUtLTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjbGlja3MrKztcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtaW5lLlNjb3JlICsgc2NvcmU7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgTWluZXN3ZWVwZXJDb25maWdcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgaW50PyBSb3dzIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50PyBDb2x1bW5zIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQ/IENlbGxXaWR0aCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0PyBXaWR0aCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0PyBIZWlnaHQgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgU2VlZCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBpbnQgQm9tYkNvdW50IHsgZ2V0OyBzZXQ7IH1cclxuXG4gICAgXG5wcml2YXRlIGZsb2F0PyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fQ2VsbFdpZHRoPTQwO3ByaXZhdGUgZmxvYXQ/IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19XaWR0aD02MDA7cHJpdmF0ZSBmbG9hdD8gX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0hlaWdodD02MDA7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX1NlZWQ9MTAwO3ByaXZhdGUgaW50IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Cb21iQ291bnQ9MjA7fVxyXG4gICAgcHVibGljIHN0cnVjdCBDZWxsUGFyYW1zXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGludCBSb3cgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBDb2x1bW4geyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFdpZHRoIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgQ2VsbFBhcmFtcyhpbnQgcm93LCBpbnQgY29sdW1uLCBmbG9hdCB3aWR0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJvdyA9IHJvdztcclxuICAgICAgICAgICAgQ29sdW1uID0gY29sdW1uO1xyXG4gICAgICAgICAgICBXaWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW50ZXJmYWNlIElNaW5lc3dlZXBlckJhc2VcclxuICAgIHtcclxuICAgICAgICBib29sIENsaWNrT25DZWxsKEJhc2VDZWxsIGl0ZW0sIGJvb2wgcGxhY2VBc0ZsYWcpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNsYXNzIE1pbmVzd2VlcGVyQmFzZSA6IElNaW5lc3dlZXBlckJhc2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTWluZXN3ZWVwZXJCYXNlKClcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgTWluZXN3ZWVwZXJDb25maWcgQ29uZmlnIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIE1pbmVzd2VlcGVyR3JpZCBHcmlkIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IENvbHVtbnMgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgUm93cyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFdpZHRoIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgSGVpZ2h0IHsgZ2V0OyBzZXQ7IH1cclxuI2lmICFCcmlkZ2VcclxuICAgICAgICBbSnNvbklnbm9yZV1cclxuI2VuZGlmXHJcbnB1YmxpYyBJRW51bWVyYWJsZTxCYXNlQ2VsbD4gQ2VsbHNcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Ub1RlbXAoXCJrZXkxXCIsR3JpZCkhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPE1pbmVzd2VlcGVyR3JpZD4oXCJrZXkxXCIpLkNlbGxzOihMaXN0PEJhc2VDZWxsPiludWxsO1xyXG4gICAgfVxyXG59I2lmICFCcmlkZ2VcclxuICAgICAgICBbSnNvbklnbm9yZV1cclxuI2VuZGlmXHJcbnB1YmxpYyB2aXJ0dWFsIGludCBNYXhTY29yZVxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gR3JpZC5DZWxscy5Db3VudDtcclxuICAgIH1cclxufSNpZiAhQnJpZGdlXHJcbiAgICAgICAgW0pzb25JZ25vcmVdXHJcbiNlbmRpZlxyXG5wdWJsaWMgdmlydHVhbCBpbnQgU2NvcmVcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuQ291bnQ8QmFzZUNlbGw+KEdyaWQuQ2VsbHMsKEZ1bmM8QmFzZUNlbGwsYm9vbD4pKHAgPT4gcC5WaXNpYmxlKSkgLSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkNvdW50PEJhc2VDZWxsPihHcmlkLkNlbGxzLChGdW5jPEJhc2VDZWxsLGJvb2w+KShwID0+IHAuRmxhZykpO1xyXG4gICAgfVxyXG59I2lmICFCcmlkZ2VcclxuICAgICAgICBbSnNvbklnbm9yZV1cclxuI2VuZGlmXHJcbnB1YmxpYyBib29sIEhhc0JvbWJzXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkNvdW50PEJhc2VDZWxsPihDZWxscywoRnVuYzxCYXNlQ2VsbCxib29sPikocCA9PiBwLkJvbWIpKSA+IDA7XHJcbiAgICB9XHJcbn1wdWJsaWMgYm9vbCBHYW1lRW5kXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAoV2luIHx8IExvc3QpO1xyXG4gICAgfVxyXG59cHJpdmF0ZSBib29sIEFsbEZsYWdnZWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8QmFzZUNlbGw+KEdyaWQuQ2VsbHMsKEZ1bmM8QmFzZUNlbGwsYm9vbD4pKHAgPT4gcC5Cb21iKSkuQWxsKChGdW5jPEJhc2VDZWxsLGJvb2w+KShwID0+IHAuRmxhZykpO1xyXG4gICAgfVxyXG59cHJpdmF0ZSBib29sIEFsbFZpc2libGVcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8QmFzZUNlbGw+KEdyaWQuQ2VsbHMsKEZ1bmM8QmFzZUNlbGwsYm9vbD4pKHAgPT4gIXAuQm9tYikpLkFsbCgoRnVuYzxCYXNlQ2VsbCxib29sPikocCA9PiBwLlZpc2libGUpKTtcclxuICAgIH1cclxufXB1YmxpYyBib29sIFdpblxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gKEFsbEZsYWdnZWQgfHwgQWxsVmlzaWJsZSkgJiYgSGFzQm9tYnM7XHJcbiAgICB9XHJcbn1wdWJsaWMgYm9vbCBMb3N0XHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkFueTxCYXNlQ2VsbD4oR3JpZC5DZWxscywoRnVuYzxCYXNlQ2VsbCxib29sPikocCA9PiBwLlZpc2libGUgJiYgcC5Cb21iKSk7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgdm9pZCBUb2dnbGVGbGFnQ2VsbChCYXNlQ2VsbCBpdGVtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaXRlbS5GbGFnID0gIWl0ZW0uRmxhZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNob3dDZWxsKEJhc2VDZWxsIGl0ZW0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Bbnk8QmFzZUNlbGw+KEdyaWQuQ2VsbHMsKEZ1bmM8QmFzZUNlbGwsYm9vbD4pKHAgPT4gcC5Cb21iKSkgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgIFNldHVwQm9tYnMoQ29uZmlnLkJvbWJDb3VudCwgQ29uZmlnLlNlZWQsIGl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGl0ZW0uRmxhZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9nZ2xlRmxhZ0NlbGwoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGl0ZW0uVmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLkJvbWIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIE9uSGFzTG9zdCgpO1xyXG4gICAgICAgICAgICAgICAgT25HYW1lRW5kZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbS5WYWx1ZSA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTaG93T3RoZXJzKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAodmFyIGdyaWRDZWxsIGluIEdyaWQuQ2VsbHMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFN5c3RlbS5MaW5xLkVudW1lcmFibGUuQW55PEJhc2VDZWxsPihHcmlkLlNxdWFyZUNlbGxzKGdyaWRDZWxsKSwoRnVuYzxCYXNlQ2VsbCxib29sPikocCA9PiBwLlZhbHVlID09IDAgJiYgcC5Cb21iICE9IHRydWUgJiYgcC5WaXNpYmxlKSkpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmlkQ2VsbC5WaXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIENsaWNrT25DZWxsKEJhc2VDZWxsIGl0ZW0sIGJvb2wgcGxhY2VBc0ZsYWcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5WaXNpYmxlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwbGFjZUFzRmxhZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU2hvd0NlbGwoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2dnbGVGbGFnQ2VsbChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoV2luKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBPbkhhc1dvbigpO1xyXG4gICAgICAgICAgICAgICAgT25HYW1lRW5kZWQodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBDYWxjdWxhdGVCb21icyhCYXNlQ2VsbCBjZWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IG51bU9mQm9tYnMgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGludCBpID0gLTE7IGkgPCAyOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaW50IGogPSAtMTsgaiA8IDI7IGorKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29sdW1uID0gY2VsbC5Db2x1bW4gKyBpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSBjZWxsLlJvdyArIGo7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdyA+PSAwICYmIHJvdyA8PSBSb3dzICYmIGNvbHVtbiA+PSAwICYmIGNvbHVtbiA8PSBDb2x1bW5zKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MlwiLEdyaWQuQ2VsbHMuRmlyc3RPckRlZmF1bHQ8QmFzZUNlbGw+KChGdW5jPEJhc2VDZWxsLGJvb2w+KShwID0+IHAuUm93ID09IHJvdyAmJiBwLkNvbHVtbiA9PSBjb2x1bW4pKSkhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPEJhc2VDZWxsPihcImtleTJcIikuQm9tYjooYm9vbD8pbnVsbCkgPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtT2ZCb21icysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjZWxsLlZhbHVlID0gbnVtT2ZCb21icztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlc2V0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNldHVwKENvbmZpZyk7XHJcbiAgICAgICAgICAgIFNob3coKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFNob3dPdGhlcnMoQmFzZUNlbGwgY2VsbClcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGludCBpID0gLTE7IGkgPCAyOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaW50IGogPSAtMTsgaiA8IDI7IGorKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29sdW1uID0gY2VsbC5Db2x1bW4gKyBpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSBjZWxsLlJvdyArIGo7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdyA+PSAwICYmIHJvdyA8IEdyaWQuUm93cyAmJiBjb2x1bW4gPj0gMCAmJiBjb2x1bW4gPCBHcmlkLkNvbHVtbnMpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmVpZ2hib3IgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkZpcnN0T3JEZWZhdWx0PEJhc2VDZWxsPihHcmlkLkNlbGxzLChGdW5jPEJhc2VDZWxsLGJvb2w+KShwID0+IHAuUm93ID09IHJvdyAmJiBwLkNvbHVtbiA9PSBjb2x1bW4pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChuZWlnaGJvciE9bnVsbD9uZWlnaGJvci5WYWx1ZTooaW50PyludWxsKSA9PSAwICYmIG5laWdoYm9yLlZpc2libGUgIT0gdHJ1ZSAmJiBuZWlnaGJvci5Cb21iICE9IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5laWdoYm9yLlZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2hvd090aGVycyhuZWlnaGJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vY2VsbC5TaG93KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyIEhhc0xvc3Q7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlciBIYXNXb247XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxib29sPiBHYW1lRW5kZWQ7XHJcbiAgICAgICAgaW50ZXJuYWwgdm9pZCBTaG93KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKHZhciBpdGVtIGluIEdyaWQuQ2VsbHMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uU2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGZsb2F0IFNldERpbWVuc2lvbnMoZmxvYXQgd2lkdGgsIGZsb2F0IGhlaWdodClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENvbmZpZy5XaWR0aCA9IHdpZHRoO1xyXG4gICAgICAgICAgICBDb25maWcuSGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgICAgICBmbG9hdCBjZWxsV2lkdGggPSAwO1xyXG5pbnQgcm93cztpbnQgY29sdW1uczsgICAgICAgICAgICBpZiAoKHJvd3MgPSBDb25maWcuUm93cyBpcyBpbnQgPyAoaW50KUNvbmZpZy5Sb3dzIDogQnJpZGdlLlNjcmlwdC5Xcml0ZTxpbnQ+KFwibnVsbFwiKSkgIT0gbnVsbCYmIChjb2x1bW5zID0gQ29uZmlnLkNvbHVtbnMgaXMgaW50ID8gKGludClDb25maWcuQ29sdW1ucyA6IEJyaWRnZS5TY3JpcHQuV3JpdGU8aW50PihcIm51bGxcIikpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNlbGxXaWR0aCA9IE1hdGguTWluKHdpZHRoLCBoZWlnaHQpIC8gTWF0aC5NaW4ocm93cywgY29sdW1ucyk7XHJcbiAgICAgICAgICAgICAgICBHcmlkLlNldERpbWVuc2lvbnMoY2VsbFdpZHRoLDAsMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNlbGxXaWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNldHVwKE1pbmVzd2VlcGVyQ29uZmlnIGNvbmZpZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICAgICAgdmFyIGNlbGx3aWR0aCA9IGNvbmZpZy5DZWxsV2lkdGggPz8gMTA7XHJcbiAgICAgICAgICAgIFdpZHRoID0gY29uZmlnLldpZHRoID8/IDEwMDtcclxuICAgICAgICAgICAgSGVpZ2h0ID0gY29uZmlnLkhlaWdodCA/PyAxMDA7XHJcbiAgICAgICAgICAgIGlmIChjb25maWcuQ29sdW1ucyAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDb2x1bW5zID0gY29uZmlnLkNvbHVtbnMgPz8gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBDb2x1bW5zID0gKGludCkoV2lkdGggLyBjZWxsd2lkdGgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbmZpZy5Sb3dzICE9IG51bGwpIFJvd3MgPSBjb25maWcuUm93cyA/PyAwO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBSb3dzID0gKGludCkoSGVpZ2h0IC8gY2VsbHdpZHRoKTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgR3JpZCA9IG5ldyBNaW5lc3dlZXBlckdyaWQoUm93cywgQ29sdW1ucywgY2VsbHdpZHRoKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFJhbmRvbSByYW5kb207XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBTZXR1cEJvbWJzKGludCBudW1PZkJvbWJzLCBpbnQgc2VlZCwgQmFzZUNlbGwgZmlyc3RDZWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy92YXIgbnVtT2ZCb21icyA9IDIwO1xyXG4gICAgICAgICAgICByYW5kb20gPSByYW5kb20gPz8gbmV3IFJhbmRvbShzZWVkKTtcclxuICAgICAgICAgICAgLy9jcmVhdGUgYm9tYnNcclxuICAgICAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCBudW1PZkJvbWJzOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBjZWxscyA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8QmFzZUNlbGw+KEdyaWQuQ2VsbHMsKEZ1bmM8QmFzZUNlbGwsYm9vbD4pKHAgPT4gcC5Cb21iICE9IHRydWUgJiYgcCAhPSBmaXJzdENlbGwpKS5Ub0xpc3QoKTtcclxuICAgICAgICAgICAgICAgIGNlbGxzW3JhbmRvbS5OZXh0KDAsIGNlbGxzLkNvdW50IC0gMSldLkJvbWIgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3NldCB2YWx1ZXNcclxuICAgICAgICAgICAgZm9yZWFjaCAodmFyIGl0ZW0gaW4gR3JpZC5DZWxscylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uQm9tYiAhPSB0cnVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIENhbGN1bGF0ZUJvbWJzKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgdmlydHVhbCB2b2lkIE9uSGFzV29uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEhhc1dvbiE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+SGFzV29uLkludm9rZSh0aGlzLCBFdmVudEFyZ3MuRW1wdHkpKTpudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIHZpcnR1YWwgdm9pZCBPbkhhc0xvc3QoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgSGFzTG9zdCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+SGFzTG9zdC5JbnZva2UodGhpcywgRXZlbnRBcmdzLkVtcHR5KSk6bnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCB2aXJ0dWFsIHZvaWQgT25HYW1lRW5kZWQoYm9vbCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2FtZUVuZGVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5HYW1lRW5kZWQuSW52b2tlKHRoaXMsIGUpKTpudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG5cclxubmFtZXNwYWNlIE1pbmVzd2VlcGVyXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgRXh0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGVbXSBUb0RvdWJsZUFycmF5KHRoaXMgaW50W10gYXJyYXkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IG5ldyBEb3VibGVbYXJyYXkuTGVuZ3RoXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lkxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsaXN0W2ldID0gYXJyYXlbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nIEFycmF5Q29udGVudFN0cmluZzxUPih0aGlzIFRbXSBhcnJheSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBidWlsZGVyID0gbmV3IFN0cmluZ0J1aWxkZXIoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGFycmF5Lkxlbmd0aDsgaW5kZXgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHgxID0gYXJyYXlbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgYnVpbGRlci5BcHBlbmQoXCJ7IFwiICsgeDEgKyBcIiB9XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLlRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG5cclxubmFtZXNwYWNlIE1pbmVzd2VlcGVyXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNaW5lc3dlZXBlckdyaWRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIEdldFN0cmluZ1JlcHJlc2VudGF0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBzdHIgPSBuZXcgU3RyaW5nQnVpbGRlcigpO1xyXG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgYmFzZUNlbGxzIGluIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuR3JvdXBCeTxCYXNlQ2VsbCxpbnQ+KENlbGxzLChGdW5jPEJhc2VDZWxsLGludD4pKHA9PnAuUm93KSkuT3JkZXJCeTxpbnQ+KChGdW5jPEdyb3VwaW5nPGludCxCYXNlQ2VsbD4saW50PikocD0+cC5LZXkpKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAodmFyIGJhc2VDZWxsIGluIGJhc2VDZWxscylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHIuQXBwZW5kKGJhc2VDZWxsLkRpc3BsYXlWYWx1ZSgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0ci5BcHBlbmRMaW5lKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHN0ci5Ub1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgQmFzZUNlbGxbXSBTcXVhcmVDZWxscyhCYXNlQ2VsbCBjZWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGNlbGxzID0gbmV3IExpc3Q8QmFzZUNlbGw+KCk7XHJcbiAgICAgICAgICAgIGZvciAoaW50IGkgPSAtMTsgaSA8IDI7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgaiA9IC0xOyBqIDwgMjsgaisrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2x1bW4gPSBjZWxsLkNvbHVtbiArIGk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IGNlbGwuUm93ICsgajtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocm93ID49IDAgJiYgcm93IDwgUm93cyAmJiBjb2x1bW4gPj0gMCAmJiBjb2x1bW4gPCBDb2x1bW5zKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5laWdoYm9yID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5GaXJzdE9yRGVmYXVsdDxCYXNlQ2VsbD4oQ2VsbHMsKEZ1bmM8QmFzZUNlbGwsYm9vbD4pKHAgPT4gcC5Sb3cgPT0gcm93ICYmIHAuQ29sdW1uID09IGNvbHVtbikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbHMuQWRkKG5laWdoYm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNlbGxzLlRvQXJyYXkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBNaW5lc3dlZXBlckdyaWQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBNaW5lc3dlZXBlckdyaWQoaW50IHJvd3MsIGludCBjb2x1bW5zLCBmbG9hdCB3aWR0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJvd3MgPSByb3dzO1xyXG4gICAgICAgICAgICBDb2x1bW5zID0gY29sdW1ucztcclxuICAgICAgICAgICAgV2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgU2V0dXAoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIExpc3Q8QmFzZUNlbGw+IENlbGxzIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU2V0RGltZW5zaW9ucyhmbG9hdCB3aWR0aCwgZmxvYXQgeE9mZnNldCwgZmxvYXQgeU9mZnNldClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKHZhciBiYXNlQ2VsbCBpbiBDZWxscylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYmFzZUNlbGwuV2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgICAgIGJhc2VDZWxsLlhPZmZzZXQgPSB4T2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgYmFzZUNlbGwuWU9mZnNldCA9IHlPZmZzZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBTZXR1cCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDZWxscyA9IG5ldyBMaXN0PEJhc2VDZWxsPihSb3dzICogQ29sdW1ucyk7XHJcbiAgICAgICAgICAgIGZvciAoaW50IGkgPSAwOyBpIDwgUm93czsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGludCBqID0gMDsgaiA8IENvbHVtbnM7IGorKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IG5ldyBCYXNlQ2VsbFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUm93ID0gaSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ29sdW1uID0gaixcclxuICAgICAgICAgICAgICAgICAgICAgICAgV2lkdGggPSBXaWR0aFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgQ2VsbHMuQWRkKGNlbGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaW50IFJvd3MgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBDb2x1bW5zIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBXaWR0aCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZS5RVW5pdDtcclxuXHJcbm5hbWVzcGFjZSBNaW5lc3dlZXBlclxyXG57XHJcbiAgICBcclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgTmV1cmFsTmV0d29ya1Rlc3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTmV1cmFsTmV0d29ya1Rlc3QoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUVVuaXQuVGVzdChcImlucHV0VGVzdFwiLCAoQWN0aW9uPEFzc2VydD4pSW5wdXRUZXN0KTtcclxuICAgICAgICAgICAgUVVuaXQuVGVzdChcImhpZGRlbkxheWVyVGVzdFwiLCAoQWN0aW9uPEFzc2VydD4pSGlkZGVuTGF5ZXJUZXN0KTtcclxuICAgICAgICAgICAgUVVuaXQuVGVzdChcIk91dHB1dFRlc3RcIiwgKEFjdGlvbjxBc3NlcnQ+KU91dHB1dFRlc3QpO1xyXG4gICAgICAgICAgICBRVW5pdC5UZXN0KFwiV2VpZ2h0VGVzdFwiLCAoQWN0aW9uPEFzc2VydD4pV2VpZ2h0VGVzdCk7XHJcbiAgICAgICAgICAgIFFVbml0LlRlc3QoXCJOZXVyb0V2b2x1dGlvblRlc3RcIiwgKEFjdGlvbjxBc3NlcnQ+KU5ldXJvRXZvbHV0aW9uKTtcclxuICAgICAgICAgICAgUVVuaXQuVGVzdChcIkV2b2x1dGlvblRlc3RcIiwgKEFjdGlvbjxBc3NlcnQ+KUV2b2x1dGlvblRlc3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEV2b2x1dGlvblRlc3QoQXNzZXJ0IGFzc2VydClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByYW5kb20gPSBuZXcgUmFuZG9tKDEwMCk7XHJcbiAgICAgICAgICAgIHZhciBuZXVybyA9IG5ldyBOZXVyb0V2b2x1dGlvbihuZXcgQmFzZUZpdG5lc3NUZXN0KCksIDEwMCwgKCkgPT4gbmV3IE5ldXJhbE5ldHdvcmsocmFuZG9tLCAxLCBuZXdbXSB7IDIsIDQsIDIgfSwgMiwgMC4xKSwgcmFuZG9tKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaW50IGkgPSAwOyBpIDwgMTA7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgTGlzdENvdW50QXNzZXJ0KGFzc2VydCwgbmV1cm8pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBMaXN0Q291bnRBc3NlcnQoQXNzZXJ0IGFzc2VydCwgTmV1cm9Fdm9sdXRpb24gbmV1cm8pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuZXVyby5Fdm9sdmVHZW5lcmF0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuT2soU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Ub0xpc3Q8SU5ldXJhbE5ldHdvcms+KG5ldXJvLk5ldXJhbE5ldHdvcmtzKS5Db3VudCA9PSAxMDAsIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9MaXN0PElOZXVyYWxOZXR3b3JrPihuZXVyby5OZXVyYWxOZXR3b3JrcykuQ291bnQuVG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgTmV1cm9Fdm9sdXRpb24oQXNzZXJ0IGFzc2VydClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByYW5kb20gPSBuZXcgUmFuZG9tKDEwMCk7XHJcbiAgICAgICAgICAgIHZhciBuZXVybyA9IG5ldyBOZXVyb0V2b2x1dGlvbihuZXcgQmFzZUZpdG5lc3NUZXN0KCksIDEwMDAsICgpID0+IG5ldyBOZXVyYWxOZXR3b3JrKHJhbmRvbSwgMSwgbmV3W10geyAyLCA0LCAyIH0sIDIsIDAuMSksIHJhbmRvbSk7XHJcbiAgICAgICAgICAgIElHZW5lcmF0aW9uIGZpcnN0R2VuID0gbnVsbDtcclxuICAgICAgICAgICAgSU5ldXJhbE5ldHdvcmsgYmVzdG5ldCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvL25ldXJvLkdlbmVyYXRpb25GaW5pc2hlZCArPSAoc2VuZGVyLCBnZW5lcmF0aW9uKSA9PiB7IENvbnNvbGUuV3JpdGVMaW5lKGdlbmVyYXRpb24uQmVzdC5FcnJvcik7IH07XHJcbiAgICAgICAgICAgIGZpcnN0R2VuID0gbmV1cm8uRXZvbHZlR2VuZXJhdGlvbigpO1xyXG4gICAgICAgICAgICAvLyBiZXN0bmV0ID0gbmV1cm8uRXZvbHZlKDEpO1xyXG4gICAgICAgICAgICBmb3IgKGludCBpID0gMDsgaSA8IDEwOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJlc3RuZXQgPSBuZXVyby5Fdm9sdmVHZW5lcmF0aW9uKCkuQmVzdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYXNzZXJ0Lk9rKGZpcnN0R2VuLkJlc3QuRXJyb3IgPCAoYmVzdG5ldCE9bnVsbD9iZXN0bmV0LkVycm9yOihkb3VibGU/KW51bGwpKTtcclxuXHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBXZWlnaHRUZXN0KEFzc2VydCBhc3NlcnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbmV0d29yayA9IG5ldyBOZXVyYWxOZXR3b3JrKG5ldyBSYW5kb20oMTIzKSwgMywgbmV3IGludFtdIHsgMSwgMiwgMyB9LCAzLCAuMSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5PayhuZXR3b3JrLldlaWdodHMuTGVuZ3RoID09IDQsIFwid2VpZ2h0cyBlcXVhbHMgXCIgKyBuZXR3b3JrLldlaWdodHMuTGVuZ3RoICsgXCIgYW5kIG5ldHdvcmsgc2l6ZSBpcyBcIiArIChuZXR3b3JrLkhpZGRlbkxheWVycy5MZW5ndGggKyAyKSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIE91dHB1dFRlc3QoQXNzZXJ0IGFzc2VydClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBuZXR3b3JrID0gbmV3IE5ldXJhbE5ldHdvcmsobmV3IFJhbmRvbSgxMjMpLCAzLCBuZXcgaW50W10geyAxLCAyLCAzIH0sIDMsIC4xKTtcclxuICAgICAgICAgICAgYXNzZXJ0Lk9rKG5ldHdvcmsuRmVlZEZvcndhcmQobmV3W10geyAxLjAsIDIsIDMgfSlbMF0gIT0gMCwgXCJPdXRwdXQ6IFwiICsgTWluZXN3ZWVwZXIuRXh0LkFycmF5Q29udGVudFN0cmluZzxkb3VibGU+KG5ldHdvcmsuRmVlZEZvcndhcmQobmV3W10geyAxLjAsIDIsIDMgfSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBIaWRkZW5MYXllclRlc3QoQXNzZXJ0IGFzc2VydClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBuZXR3b3JrID0gbmV3IE5ldXJhbE5ldHdvcmsobmV3IFJhbmRvbSgxMjMpLCAzLCBuZXcgaW50W10geyAxLCAyLCAzIH0sIDMsIC4xKTtcclxuICAgICAgICAgICAgYXNzZXJ0LkVxdWFsKG5ldHdvcmsuSGlkZGVuTGF5ZXJzLkxlbmd0aCwgMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgSW5wdXRUZXN0KEFzc2VydCBhc3NlcnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbmV0d29yayA9IG5ldyBOZXVyYWxOZXR3b3JrKG5ldyBSYW5kb20oMTIzKSwgMywgbmV3IGludFtdIHsgMSB9LCAzLCAuMSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5FcXVhbChuZXR3b3JrLklucHV0cy5MZW5ndGgsIDMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIE1pbmVzd2VlcGVyXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBQcm9ncmFtXHJcbiAgICB7XHJcbiAgICAgICAvLyBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IENhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdmFyIG5ldCA9IG5ldyBOZXVyYWxOZXR3b3JrVGVzdCgpO1xyXG4gICAgICAgICAgICB2YXIgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG5cclxubmFtZXNwYWNlIE1pbmVzd2VlcGVyXHJcbntcclxuICAgXHJcbiAgICBwdWJsaWMgY2xhc3MgQmFzZUZpdG5lc3NUZXN0IDogSUZpdG5lc3NWYWxcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYm9vbCBNYXhpbWl6ZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0IHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgRXZhbHVhdGVGaXRuZXNzKElOZXVyYWxOZXR3b3JrIG5ldHdvcmspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV0d29yay5GZWVkRm9yd2FyZChuZXdbXSB7IG5ldHdvcmsuV2VpZ2h0c1swXVswXSB9KVswXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xhc3MgTmV1cmFsTmV0d29yayA6IElOZXVyYWxOZXR3b3JrXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHN0cmluZyBUb1N0cmluZygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcIkVycm9yOiB7MH0sIElucHV0U2l6ZTogezF9XCIsRXJyb3IsSW5wdXRzLkxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgTmV1cmFsTmV0d29yayhOZXVyYWxOZXR3b3JrIG5ldHdvcmspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYmlhcyA9IG5ldHdvcmsuX2JpYXM7XHJcbiAgICAgICAgICAgIF9yYW5kb20gPSBuZXR3b3JrLl9yYW5kb207XHJcbiAgICAgICAgICAgIElucHV0cyA9IChkb3VibGVbXSluZXR3b3JrLklucHV0cy5DbG9uZSgpO1xyXG4gICAgICAgICAgICBPdXRwdXRzID0gKGRvdWJsZVtdKW5ldHdvcmsuT3V0cHV0cy5DbG9uZSgpO1xyXG4gICAgICAgICAgICBIaWRkZW5MYXllcnMgPSAoZG91YmxlW11bXSluZXR3b3JrLkhpZGRlbkxheWVycy5DbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLldlaWdodHMgPSAoZG91YmxlW11bXSluZXR3b3JrLldlaWdodHMuQ2xvbmUoKTtcclxuICAgICAgICAgICAgdGhpcy5FcnJvciA9IG5ldHdvcmsuRXJyb3I7XHJcbiAgICAgICAgICAgIC8vIEluaXRXZWlnaHRzKCk7XHJcbiAgICAgICAgICAgIC8vICBTZXRXZWlnaHRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgUmFuZG9tIF9yYW5kb207XHJcbiAgICAgICAgcHVibGljIGRvdWJsZVtdIElucHV0cyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlW11bXSBIaWRkZW5MYXllcnMgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZVtdIE91dHB1dHMgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZVtdW10gV2VpZ2h0cyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwcml2YXRlIGRvdWJsZSBfYmlhcztcclxuICAgICAgICB2b2lkIEluaXRXZWlnaHRzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFdlaWdodHMgPSBuZXcgZG91YmxlWzEgKyBIaWRkZW5MYXllcnMuTGVuZ3RoXVtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IFdlaWdodHMuTGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgV2VpZ2h0c1tpXSA9IG5ldyBkb3VibGVbSW5wdXRzLkxlbmd0aCAqIEhpZGRlbkxheWVyc1swXS5MZW5ndGhdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaSA9PSBXZWlnaHRzLkxlbmd0aCAtIDEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgV2VpZ2h0c1tpXSA9IG5ldyBkb3VibGVbT3V0cHV0cy5MZW5ndGggKiBIaWRkZW5MYXllcnNbSGlkZGVuTGF5ZXJzLkxlbmd0aCAtIDFdLkxlbmd0aF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEhpZGRlbkxheWVycy5MZW5ndGggPiAxKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgV2VpZ2h0c1tpXSA9IG5ldyBkb3VibGVbSGlkZGVuTGF5ZXJzW2kgLSAxXS5MZW5ndGggKiBIaWRkZW5MYXllcnNbaV0uTGVuZ3RoXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgU2lnbW9pZChkb3VibGUgeClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAxIC8gKDEgKyBNYXRoLkV4cCgteCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIERlcml2YXRpdmUoZG91YmxlIHgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkb3VibGUgcyA9IFNpZ21vaWQoeCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzICogKDEgLSBzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlc2V0SGlkZGVuTGF5ZXJzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgSGlkZGVuTGF5ZXJzLkxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpMSA9IDA7IGkxIDwgSGlkZGVuTGF5ZXJzW2ldLkxlbmd0aDsgaTErKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBIaWRkZW5MYXllcnNbaV1baTFdID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlW10gRmVlZEZvcndhcmQoZG91YmxlW10gaW5wdXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoaW5wdXQuTGVuZ3RoICE9IElucHV0cy5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJpbnB1dCBzaXplIG11c3QgYmUgc2FtZSBzaXplIGFzIGlucHV0IGxheWVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFJlc2V0SGlkZGVuTGF5ZXJzKCk7XHJcbiAgICAgICAgICAgIElucHV0cyA9IGlucHV0O1xyXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGVGaXJzdEhpZGRlbkxheWVyKCk7XHJcbiAgICAgICAgICAgIENhbGN1bGF0ZUxheWVyKElucHV0cywgSGlkZGVuTGF5ZXJzWzBdLCBXZWlnaHRzWzBdKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBIaWRkZW5MYXllcnNbMF0uTGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEhpZGRlbkxheWVyc1swXVtpXSArPSBfYmlhcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGludCBpID0gMTsgaSA8IEhpZGRlbkxheWVycy5MZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2FsY3VsYXRlTGF5ZXIoSGlkZGVuTGF5ZXJzW2kgLSAxXSwgSGlkZGVuTGF5ZXJzW2ldLCBXZWlnaHRzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgQ2FsY3VsYXRlTGF5ZXIoSGlkZGVuTGF5ZXJzW0hpZGRlbkxheWVycy5MZW5ndGggLSAxXSwgT3V0cHV0cywgV2VpZ2h0c1tXZWlnaHRzLkxlbmd0aCAtIDFdKTtcclxuICAgICAgICAgICAgLy9mb3IgKHZhciBpID0gMDsgaSA8IF9vdXRwdXRzLkxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgLy8gICAgdmFyIHZhbHVlID0gX291dHB1dHNbaV07XHJcbiAgICAgICAgICAgIC8vICAgIF9vdXRwdXRzW2ldID0gU2lnbW9pZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICByZXR1cm4gT3V0cHV0cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgRXJyb3IgeyBnZXQ7IHNldDsgfVxyXG5cclxuXHJcbiAgICAgICAgdm9pZCBDYWxjdWxhdGVMYXllcihkb3VibGVbXSBmaXJzdExheWVyLCBkb3VibGVbXSBzZWNvbmRMYXllciwgZG91YmxlW10gd2VpZ2h0cylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB3ZWlnaHRpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlyc3RMYXllci5MZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTEgPSAwOyBpMSA8IHNlY29uZExheWVyLkxlbmd0aDsgaTErKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgd2VpZ2h0ID0gd2VpZ2h0c1t3ZWlnaHRpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZmlyc3RMYXllcltpXSAqIHdlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRMYXllcltpMV0gKz0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0aW5kZXgrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGludCBpID0gMDsgaSA8IHNlY29uZExheWVyLkxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRMYXllcltpXSA9IFNpZ21vaWQoc2Vjb25kTGF5ZXJbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdm9pZCBTZXRXZWlnaHRzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgV2VpZ2h0cy5MZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTEgPSAwOyBpMSA8IFdlaWdodHNbaV0uTGVuZ3RoOyBpMSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vYmV0d2VlbiAtMSBhbmQgMVxyXG4gICAgICAgICAgICAgICAgICAgIFdlaWdodHNbaV1baTFdID0gX3JhbmRvbS5OZXh0RG91YmxlKCkgKiAyIC0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgTmV1cmFsTmV0d29yayhSYW5kb20gcmFuZG9tLCBpbnQgaW5wdXRzLCBpbnRbXSBoaWRkZW5sYXllciwgaW50IG91dHB1dCwgZG91YmxlIGJpYXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYmlhcyA9IGJpYXM7XHJcbiAgICAgICAgICAgIF9yYW5kb20gPSByYW5kb207XHJcbiAgICAgICAgICAgIElucHV0cyA9IG5ldyBkb3VibGVbaW5wdXRzXTtcclxuICAgICAgICAgICAgT3V0cHV0cyA9IG5ldyBkb3VibGVbb3V0cHV0XTtcclxuICAgICAgICAgICAgSGlkZGVuTGF5ZXJzID0gbmV3IGRvdWJsZVtoaWRkZW5sYXllci5MZW5ndGhdW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBoaWRkZW5sYXllci5MZW5ndGg7IGluZGV4KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBoaSA9IGhpZGRlbmxheWVyW2luZGV4XTtcclxuICAgICAgICAgICAgICAgIEhpZGRlbkxheWVyc1tpbmRleF0gPSBuZXcgZG91YmxlW2hpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBJbml0V2VpZ2h0cygpO1xyXG4gICAgICAgICAgICBTZXRXZWlnaHRzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb2JqZWN0IENsb25lKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTmV1cmFsTmV0d29yayh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBNaW5lc3dlZXBlclxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgR2VuZXJhdGlvbiA6IElHZW5lcmF0aW9uXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIElFbnVtZXJhYmxlPElOZXVyYWxOZXR3b3JrPiBOZXVyYWxOZXR3b3JrcyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgSU5ldXJhbE5ldHdvcmsgQmVzdCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgSU5ldXJhbE5ldHdvcmsgV29yc3QgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIElOZXVyYWxOZXR3b3JrIEF2ZXJhZ2UgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBHZW5lcmF0aW9uSW5kZXggeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBHZW5lcmF0aW9uKElFbnVtZXJhYmxlPElOZXVyYWxOZXR3b3JrPiBuZXVyYWxOZXR3b3JrcywgSU5ldXJhbE5ldHdvcmsgYmVzdCwgSU5ldXJhbE5ldHdvcmsgd29yc3QsIElOZXVyYWxOZXR3b3JrIGF2ZXJhZ2UsIGludCBnZW5lcmF0aW9uSW5kZXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBOZXVyYWxOZXR3b3JrcyA9IG5ldXJhbE5ldHdvcmtzO1xyXG4gICAgICAgICAgICBCZXN0ID0gYmVzdDtcclxuICAgICAgICAgICAgV29yc3QgPSB3b3JzdDtcclxuICAgICAgICAgICAgQXZlcmFnZSA9IGF2ZXJhZ2U7XHJcbiAgICAgICAgICAgIEdlbmVyYXRpb25JbmRleCA9IGdlbmVyYXRpb25JbmRleDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuI2lmIFJvc2x5blxyXG51c2luZyBOVW5pdC5GcmFtZXdvcms7XHJcbiNlbmRpZlxyXG5cclxubmFtZXNwYWNlIE1pbmVzd2VlcGVyXHJcbntcclxuI2lmIFJvc2x5blxyXG4gICAgW1Rlc3RGaXh0dXJlXVxyXG4gICAgIGNsYXNzIE5ldXJvQmFja1Rlc3RcclxuICAgIHtcclxuICAgICAgICBbVGVzdF1cclxuICAgICAgICBwdWJsaWMgdm9pZCBFcnJvclRlc3QoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGJhY2sgPSBuZXcgTmV1cm9CYWNrUHJvcGFnYXRpb24obmV3IE5ldXJhbE5ldHdvcmsobmV3IFJhbmRvbSgwKSwgMywgbmV3IFtdezB9LCAyLCAyKSwgMSApO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gMC43NTEzNjUwNztcclxuICAgICAgICAgICAgdmFyIGdvYWwgPSAwLjAxO1xyXG4gICAgICAgICAgICBBc3NlcnQuQXJlRXF1YWwoMC4yNzQ4LlRvU3RyaW5nKFwibjRcIiksYmFjay5FcnJvcihyZXN1bHQsZ29hbCkuVG9TdHJpbmcoXCJuNFwiKSk7XHJcbiAgICAgICAgICAgIEFzc2VydC5BcmVFcXVhbCgwLjc0MTQuVG9TdHJpbmcoXCJuNFwiKSwgYmFjay5QYXJ0aWFsRGVyaXZhdGl2ZU91dHB1dChnb2FsLCByZXN1bHQpLlRvU3RyaW5nKFwibjRcIikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuI2VuZGlmXHJcblxyXG4gICAgcHVibGljIGNsYXNzIE5ldXJvQmFja1Byb3BhZ2F0aW9uIDogSU9wdGltaXphdGlvbkZ1bmN0aW9uXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJTmV1cmFsTmV0d29yayBfbmV0d29yaztcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGRvdWJsZSBfc3RlcHM7XHJcbiAgICAgICAgcHVibGljIElGaXRuZXNzVmFsIEZpdG5lc3NWYWwgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBHZW5lcmF0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIE5ldXJvQmFja1Byb3BhZ2F0aW9uKElOZXVyYWxOZXR3b3JrIG5ldHdvcmssIGRvdWJsZSBzdGVwcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9uZXR3b3JrID0gbmV0d29yaztcclxuICAgICAgICAgICAgX3N0ZXBzID0gc3RlcHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFBhcnRpYWxEZXJpdmF0aXZlT3V0cHV0KGRvdWJsZSBvdXRwdXQsIGRvdWJsZSB0YXJnZXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRhcmdldCAtIG91dHB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgRXJyb3IoZG91YmxlIG91dHB1dCwgZG91YmxlIHRhcmdldClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAoMS4wIC8gMikqTWF0aC5Qb3codGFyZ2V0IC0gb3V0cHV0LDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBGZWVkRm9yd2FyZChkb3VibGVbXSBpbnB1dCxkb3VibGVbXSBwcmVkaWN0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IF9uZXR3b3JrLkZlZWRGb3J3YXJkKGlucHV0KTtcclxuICAgICAgICAgICAgdmFyIHRvdGFsRXJyb3IgPSAwLjA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0Lkxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbEVycm9yICs9IEVycm9yKHJlc3VsdFtpXSwgcHJlZGljdGlvbltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIElHZW5lcmF0aW9uIEV2b2x2ZUdlbmVyYXRpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBwdWJsaWMgSUVudW1lcmFibGU8SU5ldXJhbE5ldHdvcms+IE5ldXJhbE5ldHdvcmtzIHsgZ2V0OyB9XHJcbiAgICAgICAgcHVibGljIElOZXVyYWxOZXR3b3JrIEV2b2x2ZShkb3VibGUgZXJyb3IpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFeGNlcHRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsYXNzIE5ldXJvRXZvbHV0aW9uIDogSU9wdGltaXphdGlvbkZ1bmN0aW9uXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBpbnQgX3NwZWNpZXNDb3VudDtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IFJhbmRvbSBfcmFuZG9tO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8SUdlbmVyYXRpb24+IEdlbmVyYXRpb25GaW5pc2hlZDtcclxuICAgICAgICBwdWJsaWMgTmV1cm9Fdm9sdXRpb24oSUZpdG5lc3NWYWwgZml0bmVzc1ZhbCwgaW50IHNwZWNpZXNDb3VudCwgRnVuYzxJTmV1cmFsTmV0d29yaz4gbmV1cmFsRnVuYywgUmFuZG9tIHJhbmRvbSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEdlbmVyYXRpb24gPSAxO1xyXG4gICAgICAgICAgICBfc3BlY2llc0NvdW50ID0gc3BlY2llc0NvdW50O1xyXG4gICAgICAgICAgICBfcmFuZG9tID0gcmFuZG9tO1xyXG4gICAgICAgICAgICBGaXRuZXNzVmFsID0gZml0bmVzc1ZhbDtcclxuICAgICAgICAgICAgdmFyIGxpc3QgPSBuZXcgTGlzdDxJTmV1cmFsTmV0d29yaz4oKTtcclxuICAgICAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCBzcGVjaWVzQ291bnQ7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5BZGQobmV1cmFsRnVuYygpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTmV1cmFsTmV0d29ya3MgPSBsaXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgSUZpdG5lc3NWYWwgRml0bmVzc1ZhbCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IEdlbmVyYXRpb24geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgTXV0YXRlKElOZXVyYWxOZXR3b3JrIG5ldHdvcmspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ldHdvcmsuV2VpZ2h0cy5MZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTEgPSAwOyBpMSA8IG5ldHdvcmsuV2VpZ2h0c1tpXS5MZW5ndGg7IGkxKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdlaWdodHMgPSBuZXR3b3JrLldlaWdodHM7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbiA9IF9yYW5kb20uTmV4dCgwLCAxMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY3Jvc3NvdmVyXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbiA+PSAxMCAmJiBvcHRpb24gPCA1MClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodHNbaV1baTFdICo9IF9yYW5kb20uTmV4dERvdWJsZSgpICogMiAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vbXV0YXRlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAob3B0aW9uIDwgMTApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHRzW2ldW2kxXSA9IF9yYW5kb20uTmV4dERvdWJsZSgpICogMiAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vaW52ZXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAob3B0aW9uID49IDgwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0c1tpXVtpMV0gPSAtd2VpZ2h0c1tpXVtpMV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBJR2VuZXJhdGlvbiBFdm9sdmVHZW5lcmF0aW9uKClcclxuICAgICAgICB7XHJcbiNpZiBSb3NseW5cclxuICAgICAgICAgICAgUGFyYWxsZWwuRm9yRWFjaChOZXVyYWxOZXR3b3JrcywgcCA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZml0bmVzcyA9IEZpdG5lc3NWYWwuRXZhbHVhdGVGaXRuZXNzKHApO1xyXG4gICAgICAgICAgICAgICAgcC5FcnJvciA9IGZpdG5lc3M7XHJcbiAgICAgICAgICAgIH0pO1xyXG4jZW5kaWZcclxuI2lmIEJyaWRnZVxyXG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgbmV1cmFsTmV0d29yayBpbiBOZXVyYWxOZXR3b3JrcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpdG5lc3MgPSBGaXRuZXNzVmFsLkV2YWx1YXRlRml0bmVzcyhuZXVyYWxOZXR3b3JrKTtcclxuICAgICAgICAgICAgICAgIG5ldXJhbE5ldHdvcmsuRXJyb3IgPSBmaXRuZXNzO1xyXG4gICAgICAgICAgICB9XHJcbiNlbmRpZlxyXG4gICAgICAgICAgICB2YXIgb3JkZXJlZE5ldHdvcmtzID0gRml0bmVzc1ZhbC5NYXhpbWl6ZSA/IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuT3JkZXJCeURlc2NlbmRpbmc8SU5ldXJhbE5ldHdvcmssZG91YmxlPihOZXVyYWxOZXR3b3JrcywoRnVuYzxJTmV1cmFsTmV0d29yayxkb3VibGU+KShwID0+IHAuRXJyb3IpKS5Ub0FycmF5KCkgOiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk9yZGVyQnk8SU5ldXJhbE5ldHdvcmssZG91YmxlPihOZXVyYWxOZXR3b3JrcywoRnVuYzxJTmV1cmFsTmV0d29yayxkb3VibGU+KShwID0+IHAuRXJyb3IpKS5Ub0FycmF5KCk7XHJcbiAgICAgICAgICAgIC8va2VlcCB0b3AgNTBcclxuICAgICAgICAgICAgLy90b2RvOiBjb3B5IHRvcCA1MCBuZXR3b3JrcyBhbmQgZXZvbHZlIHRoZSBuZXcgbmV0d29ya3NcclxuXHJcbiAgICAgICAgICAgIHZhciBnZW4gPSBuZXcgR2VuZXJhdGlvbihvcmRlcmVkTmV0d29ya3MsIG9yZGVyZWROZXR3b3Jrc1swXSwgb3JkZXJlZE5ldHdvcmtzW29yZGVyZWROZXR3b3Jrcy5MZW5ndGggLSAxXSwgb3JkZXJlZE5ldHdvcmtzWyhvcmRlcmVkTmV0d29ya3MuTGVuZ3RoIC0gMSkgLyAyXSwgR2VuZXJhdGlvbik7XHJcbiAgICAgICAgICAgIEJyZWVkKHJlZiBvcmRlcmVkTmV0d29ya3MpO1xyXG4gICAgICAgICAgICB2YXIgciA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9MaXN0PElOZXVyYWxOZXR3b3JrPihvcmRlcmVkTmV0d29ya3MpO1xyXG4gICAgICAgICAgICByLlJldmVyc2UoKTtcclxuICAgICAgICAgICAgdmFyIHJldmVyc2UgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlRha2U8SU5ldXJhbE5ldHdvcms+KHIsKGludCkob3JkZXJlZE5ldHdvcmtzLkxlbmd0aCAtIG9yZGVyZWROZXR3b3Jrcy5MZW5ndGggKiAwLjEpKTtcclxuI2lmIFJvc2x5blxyXG4gICAgICAgICAgICBQYXJhbGxlbC5Gb3JFYWNoKHJldmVyc2UsIE11dGF0ZSk7XHJcbiNlbmRpZlxyXG4jaWYgQnJpZGdlXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKHZhciBuZXVyYWxOZXR3b3JrIGluIHJldmVyc2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIE11dGF0ZShuZXVyYWxOZXR3b3JrKTtcclxuICAgICAgICAgICAgfVxyXG4jZW5kaWZcclxuXHJcbiAgICAgICAgICAgIE9uR2VuZXJhdGlvbkZpbmlzaGVkKGdlbik7XHJcblxyXG4gICAgICAgICAgICBHZW5lcmF0aW9uKys7XHJcbiAgICAgICAgICAgIHJldHVybiBnZW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgQnJlZWQocmVmIElOZXVyYWxOZXR3b3JrW10gb3JkZXJlZE5ldHdvcmtzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRvcCA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVGFrZTxJTmV1cmFsTmV0d29yaz4ob3JkZXJlZE5ldHdvcmtzLChvcmRlcmVkTmV0d29ya3MuTGVuZ3RoIC0gMSkgLyAyKS5Ub0FycmF5KCk7XHJcbiAgICAgICAgICAgIHZhciBuZXduZXR3b3JrID0gbmV3IExpc3Q8SU5ldXJhbE5ldHdvcms+KCk7XHJcbiAgICAgICAgICAgIGZvciAoaW50IGkgPSAwOyBpIDwgX3NwZWNpZXNDb3VudDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBpICUgKHRvcC5MZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IHRvcC5MZW5ndGgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3bmV0d29yay5BZGQoKElOZXVyYWxOZXR3b3JrKXRvcFtpbmRleF0uQ2xvbmUoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgTmV1cmFsTmV0d29ya3MgPSBuZXduZXR3b3JrO1xyXG4gICAgICAgICAgICBvcmRlcmVkTmV0d29ya3MgPSBGaXRuZXNzVmFsLk1heGltaXplID8gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5PcmRlckJ5RGVzY2VuZGluZzxJTmV1cmFsTmV0d29yayxkb3VibGU+KE5ldXJhbE5ldHdvcmtzLChGdW5jPElOZXVyYWxOZXR3b3JrLGRvdWJsZT4pKHAgPT4gcC5FcnJvcikpLlRvQXJyYXkoKSA6IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuT3JkZXJCeTxJTmV1cmFsTmV0d29yayxkb3VibGU+KE5ldXJhbE5ldHdvcmtzLChGdW5jPElOZXVyYWxOZXR3b3JrLGRvdWJsZT4pKHAgPT4gcC5FcnJvcikpLlRvQXJyYXkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBJRW51bWVyYWJsZTxJTmV1cmFsTmV0d29yaz4gTmV1cmFsTmV0d29ya3MgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBJTmV1cmFsTmV0d29yayBFdm9sdmUoZG91YmxlIGVycm9yKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRCZXN0ID0gMC4wO1xyXG4gICAgICAgICAgICBpZiAoRml0bmVzc1ZhbC5NYXhpbWl6ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlbiA9IEV2b2x2ZUdlbmVyYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmVzdCA9IGdlbi5CZXN0LkVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvciA8PSBjdXJyZW50QmVzdClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW4uQmVzdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlbiA9IEV2b2x2ZUdlbmVyYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmVzdCA9IGdlbi5CZXN0LkVycm9yO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IgPj0gY3VycmVudEJlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuLkJlc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgdmlydHVhbCB2b2lkIE9uR2VuZXJhdGlvbkZpbmlzaGVkKElHZW5lcmF0aW9uIGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBHZW5lcmF0aW9uRmluaXNoZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PkdlbmVyYXRpb25GaW5pc2hlZC5JbnZva2UodGhpcywgZSkpOm51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIE1pbmVzd2VlcGVyXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBHYW1lIDogTWluZXN3ZWVwZXJCYXNlXHJcbiAgICB7XHJcblxyXG5cclxuICAgICAgICBSYW5kb20gcmFuZG9tID0gbmV3IFJhbmRvbSgpO1xyXG5wcml2YXRlIEhUTUxFbGVtZW50IFJlc3VsdFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gRG9jdW1lbnQuR2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRcIik7XHJcbiAgICB9XHJcbn0gICAgICAgIHB1YmxpYyBHYW1lKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEdhbWVFbmRlZCArPSAoc2VuZGVyLCBiKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gUmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgaWYgKGIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LlRleHRDb250ZW50ID0gXCJDb25ncmF0cywgeW91IHdvbiFcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuVGV4dENvbnRlbnQgPSBcIlVoIG9oLCB5b3UgaGl0IGEgYm9tYiFcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgR2FtZVNldHVwKCk7XHJcbiAgICAgICAgICAgIFNldHVwSHRtbCgpO1xyXG4gICAgICAgICAgICBTaG93KCk7XHJcbiAgICAgICAgICAgIC8vV2luZG93LlJlcXVlc3RBbmltYXRpb25GcmFtZShSZW5kZXJMb29wKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEhUTUxDYW52YXNFbGVtZW50IENhbnZhcztcclxucHVibGljIGZsb2F0IEdldFkoZmxvYXQgeSlcclxue1xyXG4gICAgcmV0dXJuIHkgLSAoZmxvYXQpQ2FudmFzLkdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLlRvcDtcclxufXB1YmxpYyBmbG9hdCBHZXRYKGZsb2F0IHgpXHJcbntcclxuICAgIHJldHVybiB4IC0gKGZsb2F0KUNhbnZhcy5HZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5MZWZ0O1xyXG59XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFNldHVwQ2FudmFzKEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcywgSFRNTEVsZW1lbnQgc2NvcmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dCA9XHJcbiAgICAgICAgICAgICAgICBjYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuQ2FudmFzLk9uTW91c2VNb3ZlID0gbWV2ZW50ID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29udGV4dC5DbGVhclJlY3QoMCwwLHdpZHRoLGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoICh2YXIgY2VsbCBpbiBHcmlkLkNlbGxzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsLkhpdChHZXRYKG1ldmVudC5DbGllbnRYKSwgR2V0WShtZXZlbnQuQ2xpZW50WSkpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5IaWdobGlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5VbkhpZ2hMaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBTaG93KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuQ2FudmFzLk9uTW91c2VEb3duID0gbWV2ZW50ID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChtZXZlbnQuQnV0dG9uID09IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2xpY2tBY3Rpb24oc2NvcmUsIGNvbnRleHQsIG1ldmVudC5DbGllbnRYLCBtZXZlbnQuQ2xpZW50WSwgX2ZsYWcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG1ldmVudC5CdXR0b24gPT0gMilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDbGlja0FjdGlvbihzY29yZSwgY29udGV4dCwgbWV2ZW50LkNsaWVudFgsIG1ldmVudC5DbGllbnRZLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuQ2FudmFzLk9uQ29udGV4dE1lbnUgPSBldmVudHQgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZXZlbnR0LlByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIENsaWNrQWN0aW9uKEhUTUxFbGVtZW50IHNjb3JlLCBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY29udGV4dCwgZmxvYXQgeCwgZmxvYXQgeSwgYm9vbCBmbGFnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29udGV4dC5DbGVhclJlY3QoMCwgMCwgKGludCkgV2lkdGgsIChpbnQpIEhlaWdodCk7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKHZhciBpdGVtIGluIEdyaWQuQ2VsbHMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLkhpdChHZXRYKHgpLCBHZXRZKHkpKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDbGlja09uQ2VsbChpdGVtLCBmbGFnKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29yZS5Jbm5lckhUTUwgPSBcIlNjb3JlOiBcIiArIFNjb3JlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBTaG93KCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBib29sIF9mbGFnO1xyXG4gICAgICAgIC8vSFRNTEhlYWRpbmdFbGVtZW50IHNjb3JlID0gbmV3IEhUTUxIZWFkaW5nRWxlbWVudChIZWFkaW5nVHlwZS5IMSk7XHJcblxyXG4gICAgICAgIHZvaWQgR2FtZVNldHVwKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNldHVwKG5ldyBNaW5lc3dlZXBlckNvbmZpZygpIHsgU2VlZCA9IHJhbmRvbS5OZXh0KCkgfSk7XHJcbiAgICAgICAgICAgIEdyaWQuQ2VsbHMuRm9yRWFjaCgoQWN0aW9uPEJhc2VDZWxsPikocCA9PiBuZXcgQ2VsbChwLCBEb2N1bWVudC5HZXRFbGVtZW50QnlJZDxIVE1MQ2FudmFzRWxlbWVudD4oYm9hcmRJZCkpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0cmluZyBib2FyZElkID0gXCJib2FyZFwiO1xyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgU2V0dXBIdG1sKClcclxuICAgICAgICB7XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIHN0cmluZyBnYW1lSWQgPSBcImdhbWVcIjtcclxuICAgICAgICAgICAgdmFyIHNjb3JlSWQgPSBcInNjb3JlXCI7XHJcblxyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMgPSAoSFRNTENhbnZhc0VsZW1lbnQpIERvY3VtZW50LkdldEVsZW1lbnRCeUlkKGJvYXJkSWQpO1xyXG4gICAgICAgICAgICBDYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgICAgIHZhciBzY29yZSA9IERvY3VtZW50LkdldEVsZW1lbnRCeUlkKHNjb3JlSWQpO1xyXG4gICAgICAgICAgICBzY29yZS5Jbm5lckhUTUwgPSBcIlNjb3JlOiBcIjtcclxuXHJcbiAgICAgICAgICAgIFNldHVwQ2FudmFzKGNhbnZhcywgc2NvcmUpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHZhciByZXNldCA9IERvY3VtZW50LkdldEVsZW1lbnRCeUlkKFwicmVzZXRcIik7XHJcbiAgICAgICAgICAgIHZhciBmbGFnID0gRG9jdW1lbnQuR2V0RWxlbWVudEJ5SWQoXCJmbGFnXCIpO1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IERvY3VtZW50LkdldEVsZW1lbnRCeUlkKFwiZmxhZ3RleHRcIik7XHJcbiAgICAgICAgICAgIGZsYWcuT25DbGljayA9IGNsaWNrID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9mbGFnID0gIV9mbGFnO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5Jbm5lckhUTUwgPSBcIkZsYWc6IFwiICsgX2ZsYWc7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlc2V0Lk9uQ2xpY2sgPSBjbGljayA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBHYW1lU2V0dXAoKTtcclxuICAgICAgICAgICAgICAgIFNob3coKTtcclxuICAgICAgICAgICAgICAgIFJlc3VsdC5UZXh0Q29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNhbnZhcy5XaWR0aCA9IChpbnQpV2lkdGg7XHJcbiAgICAgICAgICAgIGNhbnZhcy5IZWlnaHQgPSAoaW50KUhlaWdodDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0iXQp9Cg==
