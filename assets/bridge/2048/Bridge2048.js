/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2017
 * @compiler Bridge.NET 17.10.1
 */
Bridge.assembly("Bridge2048", function ($asm, globals) {
    "use strict";

    Bridge.define("Bridge2048.Game", {
        statics: {
            fields: {
                CellEmpty: null,
                CellValue: null,
                Grid: null,
                gamebtn: null
            },
            ctors: {
                init: function () {
                    this.CellEmpty = "cell cell-empty";
                    this.CellValue = "cell cell-value";
                    this.Grid = "grid";
                    this.gamebtn = "gamebtn";
                }
            }
        },
        fields: {
            _buttons: null,
            _twenty: null,
            notify: null,
            shouldStop: false
        },
        ctors: {
            init: function () {
                this._twenty = new PathFinder.TwentyFortyEight.$ctor1(4, 4, 123);
                this.notify = document.getElementById("game-notify");
                this.shouldStop = false;
            },
            ctor: function () {
                var $t;
                this.$initialize();
                this._twenty.PlaceRandom();
                var gamediv = "game";
                var maindiv = document.getElementById(gamediv);
                var toolbar = document.getElementById("toolbar");
                var startai = ($t = document.createElement("button"), $t.innerHTML = "Start Ai", $t.onclick = Bridge.fn.bind(this, $asm.$.Bridge2048.Game.f1), $t.className = Bridge2048.Game.gamebtn, $t);
                var stopai = ($t = document.createElement("button"), $t.textContent = "Stop Ai", $t.onclick = Bridge.fn.bind(this, $asm.$.Bridge2048.Game.f2), $t.className = Bridge2048.Game.gamebtn, $t);

                var reset = ($t = document.createElement("button"), $t.innerHTML = "Reset", $t.onclick = Bridge.fn.bind(this, $asm.$.Bridge2048.Game.f3), $t.className = Bridge2048.Game.gamebtn, $t);
                toolbar.appendChild(startai);
                toolbar.appendChild(reset);
                toolbar.appendChild(stopai);
                this._buttons = System.Array.init(16, null, HTMLElement);
                var iter = 0;
                for (var i = 0; i < 4; i = (i + 1) | 0) {
                    var div = ($t = document.createElement("div"), $t.className = "gridrow", $t);
                    for (var j = 0; j < 4; j = (j + 1) | 0) {
                        var button = document.createElement("div");
                        this._buttons[System.Array.index(iter, this._buttons)] = button;
                        var value = this._twenty.getItem(i, j);
                        this.SetValue(value, iter);
                        div.appendChild(button);
                        iter = (iter + 1) | 0;
                    }
                    maindiv.appendChild(div);


                }

                var test = document.getElementById(gamediv);


                var hammertime = new Hammer(test);

                hammertime.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

                hammertime.on("swipe", Bridge.fn.bind(this, $asm.$.Bridge2048.Game.f4));

                document.onkeydown = Bridge.fn.bind(this, $asm.$.Bridge2048.Game.f5);
            }
        },
        methods: {
            Update: function () {
                var iter = 0;
                for (var i = 0; i < 4; i = (i + 1) | 0) {
                    for (var j = 0; j < 4; j = (j + 1) | 0) {
                        var value = this._twenty.getItem(i, j);

                        this.SetValue(value, iter);
                        iter = (iter + 1) | 0;
                    }
                }

                if (this._twenty.Win()) {
                    this.notify.textContent = "Congrats! you won!";
                }

                if (this._twenty.Lost()) {
                    this.notify.textContent = "Uh oh, you lost!";
                }
            },
            SetValue: function (value, iter) {
                if (value !== 0) {
                    this._buttons[System.Array.index(iter, this._buttons)].className = Bridge2048.Game.CellValue;
                    this._buttons[System.Array.index(iter, this._buttons)].textContent = Bridge.toString(value);
                } else {
                    this._buttons[System.Array.index(iter, this._buttons)].className = Bridge2048.Game.CellEmpty;
                    this._buttons[System.Array.index(iter, this._buttons)].textContent = "0";
                }
            },
            Reset: function () {
                this._twenty.Reset();
                this.notify.textContent = "";
                this.Update();
            },
            StartMiniMax: function () {
                var $step = 0,
                    $task1, 
                    $task2, 
                    $task3, 
                    $task4, 
                    $jumpFromFinally, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1,2,3,4,5,6,7], $step);
                            switch ($step) {
                                case 0: {
                                    this.shouldStop = false;
                                    $step = 1;
                                    continue;
                                }
                                case 1: {
                                    if ( this._twenty.Lost() !== true || this._twenty.Win() !== true ) {
                                        $step = 2;
                                        continue;
                                    } 
                                    $step = 7;
                                    continue;
                                }
                                case 2: {
                                    if (this.shouldStop) {
                                        $step = 7;
                                        continue;
                                    }
                                    Bridge.sleep(100);
                                    $task1 = System.Threading.Tasks.Task.run(Bridge.fn.bind(this, $asm.$.Bridge2048.Game.f6));
                                    $step = 3;
                                    if ($task1.isCompleted()) {
                                        continue;
                                    }
                                    $task1.continue($asyncBody);
                                    return;
                                }
                                case 3: {
                                    $task1.getAwaitedResult();
                                    Bridge.sleep(100);

                                    $task2 = System.Threading.Tasks.Task.run(Bridge.fn.bind(this, $asm.$.Bridge2048.Game.f7));
                                    $step = 4;
                                    if ($task2.isCompleted()) {
                                        continue;
                                    }
                                    $task2.continue($asyncBody);
                                    return;
                                }
                                case 4: {
                                    $task2.getAwaitedResult();
                                    Bridge.sleep(100);

                                    $task3 = System.Threading.Tasks.Task.run(Bridge.fn.bind(this, $asm.$.Bridge2048.Game.f8));
                                    $step = 5;
                                    if ($task3.isCompleted()) {
                                        continue;
                                    }
                                    $task3.continue($asyncBody);
                                    return;
                                }
                                case 5: {
                                    $task3.getAwaitedResult();
                                    Bridge.sleep(100);

                                    $task4 = System.Threading.Tasks.Task.run(Bridge.fn.bind(this, $asm.$.Bridge2048.Game.f9));
                                    $step = 6;
                                    if ($task4.isCompleted()) {
                                        continue;
                                    }
                                    $task4.continue($asyncBody);
                                    return;
                                }
                                case 6: {
                                    $task4.getAwaitedResult();
                                    
                                    $step = 1;
                                    continue;
                                }
                                case 7: {
                                    return;
                                }
                                default: {
                                    return;
                                }
                            }
                        }
                    }, arguments);

                $asyncBody();
            }
        }
    });

    Bridge.ns("Bridge2048.Game", $asm.$);

    Bridge.apply($asm.$.Bridge2048.Game, {
        f1: function (ev) {
            this.StartMiniMax();
        },
        f2: function (ev) {
            this.shouldStop = true;
        },
        f3: function (ev) {
            this.Reset();
        },
        f4: function (input) {
            if (input.direction === Hammer.DIRECTION_LEFT) {
                this._twenty.Play(PathFinder.Direction.Left);
                this.Update();
            } else if (input.direction === Hammer.DIRECTION_RIGHT) {
                this._twenty.Play(PathFinder.Direction.Right);
                this.Update();
            } else if (input.direction === Hammer.DIRECTION_UP) {
                this._twenty.Play(PathFinder.Direction.Up);
                this.Update();
            } else if (input.direction === Hammer.DIRECTION_DOWN) {
                this._twenty.Play(PathFinder.Direction.Down);
                this.Update();
            }
        },
        f5: function (keyboard) {
            if (keyboard.keyCode === 38 || keyboard.keyCode === 87) {
                this._twenty.Play(PathFinder.Direction.Up);
            }
            if (keyboard.keyCode === 40 || keyboard.keyCode === 83) {
                this._twenty.Play(PathFinder.Direction.Down);
            }
            if (keyboard.keyCode === 39 || keyboard.keyCode === 68) {
                this._twenty.Play(PathFinder.Direction.Right);
            }
            if (keyboard.keyCode === 37 || keyboard.keyCode === 65) {
                this._twenty.Play(PathFinder.Direction.Left);
            }
            this.Update();
        },
        f6: function () {
        this._twenty.Play(PathFinder.Direction.Up);
        this.Update();
    },
        f7: function () {
        this._twenty.Play(PathFinder.Direction.Right);
        this.Update();
    },
        f8: function () {
        this._twenty.Play(PathFinder.Direction.Down);
        this.Update();
    },
        f9: function () {
        this._twenty.Play(PathFinder.Direction.Left);
        this.Update();
    }
    });

    Bridge.define("Bridge2048.Main", {
        statics: {
            ctors: {
                init: function () {
                    Bridge.ready(this.Init);
                }
            },
            methods: {
                Init: function () {
                    var game = new Bridge2048.Game();
                }
            }
        },
        $entryPoint: true
    });

    Bridge.define("PathFinder.ArrayExt", {
        statics: {
            methods: {
                ToPointArray: function (T, array) {
                    var width = System.Array.getLength(array, 1);
                    var height = System.Array.getLength(array, 0);
                    var list = new (System.Collections.Generic.List$1(PathFinder.Point)).ctor();
                    for (var i = 0; i < height; i = (i + 1) | 0) {
                        for (var j = 0; j < width; j = (j + 1) | 0) {
                            list.add(new PathFinder.Point.$ctor1(j, i));
                        }
                    }
                    return list.ToArray();
                },
                ToArray: function (T, array) {
                    var width = System.Array.getLength(array, 1);
                    var height = System.Array.getLength(array, 0);
                    var list = new (System.Collections.Generic.List$1(T)).ctor();
                    for (var i = 0; i < height; i = (i + 1) | 0) {
                        for (var j = 0; j < width; j = (j + 1) | 0) {
                            list.add(array.get([i, j]));
                        }
                    }
                    return list.ToArray();
                }
            }
        }
    });

    Bridge.define("PathFinder.Direction", {
        $kind: "enum",
        statics: {
            fields: {
                Left: 0,
                Right: 1,
                Up: 2,
                Down: 3
            }
        }
    });

    Bridge.define("PathFinder.MatrixType$1", function (T) { return {
        props: {
            Matrix: null,
            FlatMatrix: {
                get: function () {
                    return PathFinder.ArrayExt.ToArray(T, this.Matrix);
                }
            },
            FlatPointMatrix: {
                get: function () {
                    return PathFinder.ArrayExt.ToPointArray(T, this.Matrix);
                }
            },
            Head: {
                get: function () {
                    return System.Linq.Enumerable.from(PathFinder.ArrayExt.ToPointArray(T, this.Matrix), PathFinder.Point).where($asm.$.PathFinder.MatrixType$1.f1).select(Bridge.fn.bind(this, $asm.$.PathFinder.MatrixType$1.f2)).ToArray(T);
                }
            },
            End: {
                get: function () {
                    return System.Linq.Enumerable.from(PathFinder.ArrayExt.ToPointArray(T, this.Matrix), PathFinder.Point).where(Bridge.fn.bind(this, $asm.$.PathFinder.MatrixType$1.f3)).select(Bridge.fn.bind(this, $asm.$.PathFinder.MatrixType$1.f2)).ToArray(T);
                }
            },
            Columns: {
                get: function () {
                    return System.Array.getLength(this.Matrix, 1);
                }
            },
            Rows: {
                get: function () {
                    return System.Array.getLength(this.Matrix, 0);
                }
            }
        },
        methods: {
            GetValue$2: function (val, direction) {
                var movement = new PathFinder.Point.$ctor1(0, 0);
                if (direction === PathFinder.Direction.Left) {
                    movement = new PathFinder.Point.$ctor1(-1, 0);
                } else if (direction === PathFinder.Direction.Right) {
                    movement = new PathFinder.Point.$ctor1(1, 0);
                } else if (direction === PathFinder.Direction.Up) {
                    movement = new PathFinder.Point.$ctor1(0, -1);
                } else if (direction === PathFinder.Direction.Down) {
                    movement = new PathFinder.Point.$ctor1(0, 1);
                }
                var newval = PathFinder.Point.op_Addition(val.$clone(), movement.$clone());
                return newval.$clone();
            },
            GetValue: function (loc) {
                return this.GetValue$1(loc.Column, loc.Row);
            },
            GetValue$1: function (column, row) {
                return Bridge.cast(Bridge.unbox(System.Array.get(this.Matrix, row, column), T), T);
            },
            SetValue$1: function (x, y, value) {
                System.Array.set(this.Matrix, value, y, x);
            },
            SetValue: function (loc, value) {
                this.SetValue$1(loc.Column, loc.Row, value);
            }
        }
    }; });

    Bridge.ns("PathFinder.MatrixType$1", $asm.$);

    Bridge.apply($asm.$.PathFinder.MatrixType$1, {
        f1: function (p) {
            return p.Row === 0;
        },
        f2: function (point) {
            return this.Matrix.get([point.Row, point.Column]);
        },
        f3: function (p) {
            return p.Row === ((this.Rows - 1) | 0);
        }
    });

    Bridge.define("PathFinder.PlayResult", {
        props: {
            Direction: 0,
            Win: false,
            Moved: false,
            Lost: false,
            Score: 0,
            InvalidMove: {
                get: function () {
                    return !this.Moved;
                }
            }
        }
    });

    Bridge.define("PathFinder.Point", {
        $kind: "struct",
        statics: {
            methods: {
                op_Addition: function (a, b) {
                    return new PathFinder.Point.$ctor1(((a.Column + b.Column) | 0), ((a.Row + b.Row) | 0));
                },
                getDefaultValue: function () { return new PathFinder.Point(); }
            }
        },
        props: {
            Column: 0,
            Row: 0
        },
        ctors: {
            $ctor1: function (column, Row) {
                this.$initialize();
                this.Column = column;
                this.Row = Row;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            toString: function () {
                return "{row: " + this.Row + ", column: " + this.Column + "}";
            },
            getHashCode: function () {
                var h = Bridge.addHash([1852403652, this.Column, this.Row]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, PathFinder.Point)) {
                    return false;
                }
                return Bridge.equals(this.Column, o.Column) && Bridge.equals(this.Row, o.Row);
            },
            $clone: function (to) {
                var s = to || new PathFinder.Point();
                s.Column = this.Column;
                s.Row = this.Row;
                return s;
            }
        }
    });

    Bridge.define("PathFinder.TwentyFortyEight", {
        inherits: [PathFinder.MatrixType$1(System.Int32)],
        fields: {
            _random: null
        },
        props: {
            ZeroScore: {
                get: function () {
                    var $t;
                    var n = 0;
                    $t = Bridge.getEnumerator(this.FlatMatrix);
                    try {
                        while ($t.moveNext()) {
                            var i = $t.Current;
                            if (i === 0) {
                                n = (n + 10) | 0;
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    return n;
                }
            },
            BiggestBlock: {
                get: function () {
                    return System.Linq.Enumerable.from(this.FlatMatrix, System.Int32).max();
                }
            },
            Score: {
                get: function () {
                    return System.Linq.Enumerable.from(this.FlatMatrix, System.Int32).sum();
                }
            }
        },
        ctors: {
            ctor: function (clone) {
                this.$initialize();
                PathFinder.MatrixType$1(System.Int32).ctor.call(this);
                //Matrix =(int[,]) clone.Matrix.Clone();
                this.Matrix = System.Array.create(0, null, System.Int32, clone.Rows, clone.Columns);
                for (var i = 0; i < clone.Rows; i = (i + 1) | 0) {
                    for (var j = 0; j < clone.Columns; j = (j + 1) | 0) {
                        this.Matrix.set([i, j], clone.Matrix.get([i, j]));
                    }
                }
            },
            $ctor1: function (width, height, seed) {
                this.$initialize();
                PathFinder.MatrixType$1(System.Int32).ctor.call(this);
                this.Matrix = System.Array.create(0, null, System.Int32, width, height);
                this._random = System.Nullable.hasValue(seed) ? new System.Random.$ctor1(System.Nullable.getValue(seed)) : new System.Random.$ctor1(Date.now());
            }
        },
        methods: {
            getItem: function (row, column) {
                return this.GetValue$1(column, row);
            },
            setItem: function (row, column, value) {
                this.SetValue$1(column, row, value);
            },
            Play: function (direction) {
                var playresult = new PathFinder.PlayResult();
                var m = this.Move(direction);
                playresult.Direction = direction;
                playresult.Moved = m;
                if (m) {
                    this.PlaceRandom();

                }
                if (this.Win()) {
                    playresult.Win = true;
                }
                if (this.Lost()) {
                    playresult.Lost = true;
                }
                playresult.Score = this.Score;
                return playresult;
            },
            Lost: function () {
                if (this.CanMove(PathFinder.Direction.Right) !== true && this.CanMove(PathFinder.Direction.Down) !== true && this.CanMove(PathFinder.Direction.Up) !== true && this.CanMove(PathFinder.Direction.Left) !== true) {
                    return true;
                }
                return false;

            },
            PlaceRandom: function () {
                var places = System.Linq.Enumerable.from(this.FlatPointMatrix, PathFinder.Point).where(Bridge.fn.bind(this, $asm.$.PathFinder.TwentyFortyEight.f1));
                var enumerable = places.ToArray(PathFinder.Point);
                if (System.Linq.Enumerable.from(enumerable, PathFinder.Point).any() !== true) {
                    return;

                }
                var i = this._random.Next$2(0, ((enumerable.length - 1) | 0));

                var point = enumerable[System.Array.index(i, enumerable)].$clone();
                var val = this._random.NextDouble();

                if (val > 0.5) {
                    this.SetValue(point.$clone(), 4);
                } else {
                    this.SetValue(point.$clone(), 2);
                }



            },
            Reset: function () {
                this.Matrix = System.Array.create(0, null, System.Int32, this.Columns, this.Rows);
                this.PlaceRandom();

            },
            Show: function () {
                return this.Matrix;
            },
            Win: function () {
                if (System.Linq.Enumerable.from(this.FlatMatrix, System.Int32).any($asm.$.PathFinder.TwentyFortyEight.f2)) {
                    return true;
                }
                return false;
            },
            CanMove: function (direction) {
                return this.CanMove$1(direction, new PathFinder.TwentyFortyEight.ctor(this));
            },
            CanMove$1: function (direction, game) {

                var moved = false;

                if (direction === PathFinder.Direction.Left) {

                    for (var i = 0; i < game.Rows; i = (i + 1) | 0) {
                        moved = game.MoveLeft(moved, i);
                        for (var j = 1; j < game.Columns; j = (j + 1) | 0) {
                            var movePoint = new PathFinder.Point.$ctor1(((j - 1) | 0), i);
                            var moveValue = game.GetValue(movePoint.$clone());
                            var thisvalue = game.GetValue$1(j, i);
                            if (thisvalue === 0) {
                                continue;
                            }
                            if (moveValue === thisvalue) {
                                game.SetValue(movePoint.$clone(), ((thisvalue + moveValue) | 0));
                                game.SetValue$1(j, i, 0);
                                moved = true;
                            }
                        }
                        moved = game.MoveLeft(moved, i);
                    }

                }
                if (direction === PathFinder.Direction.Right) {


                    for (var i1 = 0; i1 < game.Rows; i1 = (i1 + 1) | 0) {
                        moved = game.MoveRight(moved, i1);
                        for (var j1 = (game.Columns - 2) | 0; j1 > -1; j1 = (j1 - 1) | 0) {
                            var movePoint1 = new PathFinder.Point.$ctor1(((j1 + 1) | 0), i1);
                            var moveValue1 = game.GetValue(movePoint1.$clone());
                            var thisvalue1 = game.GetValue$1(j1, i1);
                            if (moveValue1 === thisvalue1 && thisvalue1 !== 0) {
                                game.SetValue(movePoint1.$clone(), ((thisvalue1 + moveValue1) | 0));
                                game.SetValue$1(j1, i1, 0);
                                moved = true;

                            }
                            //else if (moveValue == 0 && thisvalue != 0)
                            //{
                            //    SetValue(movePoint, thisvalue);
                            //    SetValue(i, j, 0);
                            //    moved = true;

                            //}
                        }
                        moved = game.MoveRight(moved, i1);
                    }


                }
                if (direction === PathFinder.Direction.Up) {

                    for (var i2 = 0; i2 < game.Columns; i2 = (i2 + 1) | 0) {
                        moved = game.MoveUp(moved, i2);
                        for (var j2 = 1; j2 < game.Rows; j2 = (j2 + 1) | 0) {
                            var movePoint2 = new PathFinder.Point.$ctor1(i2, ((j2 - 1) | 0));
                            var moveValue2 = game.GetValue(movePoint2.$clone());
                            var thisvalue2 = game.GetValue$1(i2, j2);
                            if (moveValue2 === thisvalue2 && thisvalue2 !== 0) {
                                game.SetValue(movePoint2.$clone(), ((thisvalue2 + moveValue2) | 0));
                                game.SetValue$1(i2, j2, 0);
                                moved = true;

                            }
                            //else if (moveValue == 0 && thisvalue != 0)
                            //{
                            //    SetValue(movePoint, thisvalue);
                            //    SetValue(i, j, 0);
                            //    moved = true;

                            //}

                        }
                        moved = game.MoveUp(moved, i2);

                    }
                }
                if (direction === PathFinder.Direction.Down) {


                    for (var i3 = 0; i3 < game.Columns; i3 = (i3 + 1) | 0) {
                        moved = game.MoveDown(moved, i3);
                        for (var j3 = (game.Rows - 2) | 0; j3 > -1; j3 = (j3 - 1) | 0) {
                            var movePoint3 = new PathFinder.Point.$ctor1(i3, ((j3 + 1) | 0));
                            var moveValue3 = game.GetValue(movePoint3.$clone());
                            var thisvalue3 = game.GetValue$1(i3, j3);
                            if (moveValue3 === thisvalue3 && thisvalue3 !== 0) {
                                game.SetValue(movePoint3.$clone(), ((thisvalue3 + moveValue3) | 0));
                                game.SetValue$1(i3, j3, 0);
                                moved = true;

                            }
                            //else if (moveValue == 0 && thisvalue != 0)
                            //{
                            //    SetValue(movePoint, thisvalue);
                            //    SetValue(i, j, 0);
                            //    moved = true;

                            //}

                        }
                        moved = game.MoveDown(moved, i3);

                    }
                }
                return moved;
            },
            Move: function (direction) {

                var moved = false;

                if (direction === PathFinder.Direction.Left) {

                    for (var i = 0; i < this.Rows; i = (i + 1) | 0) {
                        moved = this.MoveLeft(moved, i);
                        for (var j = 1; j < this.Columns; j = (j + 1) | 0) {
                            var movePoint = new PathFinder.Point.$ctor1(((j - 1) | 0), i);
                            var moveValue = this.GetValue(movePoint.$clone());
                            var thisvalue = this.GetValue$1(j, i);
                            if (thisvalue === 0) {
                                continue;
                            }
                            if (moveValue === thisvalue) {
                                this.SetValue(movePoint.$clone(), ((thisvalue + moveValue) | 0));
                                this.SetValue$1(j, i, 0);
                                moved = true;
                            }
                        }
                        moved = this.MoveLeft(moved, i);
                    }

                }
                if (direction === PathFinder.Direction.Right) {


                    for (var i1 = 0; i1 < this.Rows; i1 = (i1 + 1) | 0) {
                        moved = this.MoveRight(moved, i1);
                        for (var j1 = (this.Columns - 2) | 0; j1 > -1; j1 = (j1 - 1) | 0) {
                            var movePoint1 = new PathFinder.Point.$ctor1(((j1 + 1) | 0), i1);
                            var moveValue1 = this.GetValue(movePoint1.$clone());
                            var thisvalue1 = this.GetValue$1(j1, i1);
                            if (moveValue1 === thisvalue1 && thisvalue1 !== 0) {
                                this.SetValue(movePoint1.$clone(), ((thisvalue1 + moveValue1) | 0));
                                this.SetValue$1(j1, i1, 0);
                                moved = true;

                            }
                            //else if (moveValue == 0 && thisvalue != 0)
                            //{
                            //    SetValue(movePoint, thisvalue);
                            //    SetValue(i, j, 0);
                            //    moved = true;

                            //}
                        }
                        moved = this.MoveRight(moved, i1);
                    }


                }
                if (direction === PathFinder.Direction.Up) {

                    for (var i2 = 0; i2 < this.Columns; i2 = (i2 + 1) | 0) {
                        moved = this.MoveUp(moved, i2);
                        for (var j2 = 1; j2 < this.Rows; j2 = (j2 + 1) | 0) {
                            var movePoint2 = new PathFinder.Point.$ctor1(i2, ((j2 - 1) | 0));
                            var moveValue2 = this.GetValue(movePoint2.$clone());
                            var thisvalue2 = this.GetValue$1(i2, j2);
                            if (moveValue2 === thisvalue2 && thisvalue2 !== 0) {
                                this.SetValue(movePoint2.$clone(), ((thisvalue2 + moveValue2) | 0));
                                this.SetValue$1(i2, j2, 0);
                                moved = true;

                            }
                            //else if (moveValue == 0 && thisvalue != 0)
                            //{
                            //    SetValue(movePoint, thisvalue);
                            //    SetValue(i, j, 0);
                            //    moved = true;

                            //}

                        }
                        moved = this.MoveUp(moved, i2);

                    }
                }
                if (direction === PathFinder.Direction.Down) {


                    for (var i3 = 0; i3 < this.Columns; i3 = (i3 + 1) | 0) {
                        moved = this.MoveDown(moved, i3);
                        for (var j3 = (this.Rows - 2) | 0; j3 > -1; j3 = (j3 - 1) | 0) {
                            var movePoint3 = new PathFinder.Point.$ctor1(i3, ((j3 + 1) | 0));
                            var moveValue3 = this.GetValue(movePoint3.$clone());
                            var thisvalue3 = this.GetValue$1(i3, j3);
                            if (moveValue3 === thisvalue3 && thisvalue3 !== 0) {
                                this.SetValue(movePoint3.$clone(), ((thisvalue3 + moveValue3) | 0));
                                this.SetValue$1(i3, j3, 0);
                                moved = true;

                            }
                            //else if (moveValue == 0 && thisvalue != 0)
                            //{
                            //    SetValue(movePoint, thisvalue);
                            //    SetValue(i, j, 0);
                            //    moved = true;

                            //}

                        }
                        moved = this.MoveDown(moved, i3);

                    }
                }
                return moved;
            },
            MoveLeft: function (moved, i, actuallyMove) {
                if (actuallyMove === void 0) { actuallyMove = true; }
                for (var j = 0; j < Bridge.Int.mul(this.Columns, this.Columns); j = (j + 1) | 0) {
                    var y = j % this.Columns;
                    var movePoint = new PathFinder.Point.$ctor1(((y - 1) | 0), i);
                    if (movePoint.Column < 0) {
                        continue;
                    }
                    var moveValue = this.GetValue(movePoint.$clone());
                    var thisvalue = this.GetValue$1(y, i);
                    if (moveValue === 0 && thisvalue !== 0) {
                        if (actuallyMove) {
                            this.SetValue(movePoint.$clone(), thisvalue);
                            this.SetValue$1(y, i, 0);
                        }

                        moved = true;
                    }
                }

                return moved;
            },
            MoveUp: function (moved, column, actuallyMove) {
                if (actuallyMove === void 0) { actuallyMove = true; }
                for (var j = 0; j < Bridge.Int.mul(this.Rows, this.Rows); j = (j + 1) | 0) {
                    var y = j % this.Rows;
                    var movePoint = new PathFinder.Point.$ctor1(column, ((y - 1) | 0));
                    if (movePoint.Row < 0) {
                        continue;
                    }
                    var moveValue = this.GetValue(movePoint.$clone());
                    var thisvalue = this.GetValue$1(column, y);
                    if (moveValue === 0 && thisvalue !== 0) {
                        if (actuallyMove) {
                            this.SetValue(movePoint.$clone(), thisvalue);
                            this.SetValue$1(column, y, 0);
                        }

                        moved = true;
                    }
                }

                return moved;
            },
            MoveDown: function (moved, column, actuallyMove) {
                if (actuallyMove === void 0) { actuallyMove = true; }
                for (var j = 0; j < Bridge.Int.mul(this.Rows, this.Rows); j = (j + 1) | 0) {
                    var row = j % this.Rows;
                    var movePoint = new PathFinder.Point.$ctor1(column, ((row + 1) | 0));
                    if (movePoint.Row > ((this.Rows - 1) | 0)) {
                        continue;
                    }
                    var moveValue = this.GetValue(movePoint.$clone());
                    var thisvalue = this.GetValue$1(column, row);
                    if (moveValue === 0 && thisvalue !== 0) {
                        if (actuallyMove) {
                            this.SetValue(movePoint.$clone(), thisvalue);
                            this.SetValue$1(column, row, 0);
                        }

                        moved = true;
                    }
                }

                return moved;
            },
            MoveRight: function (moved, i, actuallyMove) {
                if (actuallyMove === void 0) { actuallyMove = true; }
                for (var j = 0; j < Bridge.Int.mul(this.Columns, this.Columns); j = (j + 1) | 0) {
                    var y = j % this.Columns;
                    var movePoint = new PathFinder.Point.$ctor1(((y + 1) | 0), i);
                    if (movePoint.Column > ((this.Columns - 1) | 0)) {
                        continue;
                    }
                    var moveValue = this.GetValue(movePoint.$clone());
                    var thisvalue = this.GetValue$1(y, i);
                    if (moveValue === 0 && thisvalue !== 0) {
                        if (actuallyMove) {
                            this.SetValue(movePoint.$clone(), thisvalue);
                            this.SetValue$1(y, i, 0);
                        }

                        moved = true;
                    }
                }

                return moved;
            }
        }
    });

    Bridge.ns("PathFinder.TwentyFortyEight", $asm.$);

    Bridge.apply($asm.$.PathFinder.TwentyFortyEight, {
        f1: function (p) {
            return this.GetValue(p.$clone()) === 0;
        },
        f2: function (p) {
            return p === 2048;
        }
    });
});
