document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("play").addEventListener("click", function(){
        document.getElementById("play").style.display = "none";
        document.getElementById("h").innerHTML = "White's turn"
        var squares = document.getElementsByClassName("grid-item");
        for (var i = 0; i < squares.length; i++){
            if (squares[i].getElementsByClassName("w").length > 0){
                squares[i].addEventListener("click", select);
            }
        }
        var pieces = document.getElementsByClassName("draggable");
        for (var i = 0; i < pieces.length; i++){
            pieces[i].addEventListener("dragstart", dragstart);
            pieces[i].addEventListener("dragend", dragend);
        }
    });
});

var turn = 0;

function wcheck(){
    let check = false;
    let whites = document.getElementsByClassName("w");
    for (let i = 0; i < whites.length; i++){
        select_white(whites[i].parentElement);
        if (document.getElementById("bking").parentElement.getElementsByClassName("ring")[0].style.display == "inline-block"){
            check = true;
        }
        resetboard();
    }
    return check;
}

function bcheck(){
    let check = false;
    let blacks = document.getElementsByClassName("b");
    for (let i = 0; i < blacks.length; i++){
        select_black(blacks[i].parentElement);
        if (document.getElementById("wking").parentElement.getElementsByClassName("ring")[0].style.display == "inline-block"){
            check = true;
        }
        resetboard();
    }
    return check;
}

function check_valid_moves_white(id){
    let squares = document.getElementsByClassName("grid-item");
    let dotlist = [];
    let ringlist = [];
    for (let i = 0; i < squares.length; i++){
        if (squares[i].getElementsByClassName("dot")[0].style.display == "inline-block"){
            dotlist.push(squares[i]);
        }
        if (squares[i].getElementsByClassName("ring")[0].style.display == "inline-block"){
            ringlist.push(squares[i]);
        }
    }
    let img = document.getElementById(id).getElementsByTagName("img")[0];
    changeturn();
    resetboard();
    let newdotlist = [];
    let newringlist = [];
    for (let dot of dotlist){
        dot.appendChild(img);
        if (!bcheck()){
            newdotlist.push(dot);
        }
        document.getElementById(id).appendChild(img);
    }
    for (let ring of ringlist){
        let oldimg = ring.getElementsByTagName("img")[0].cloneNode(true);
        ring.getElementsByTagName("img")[0].remove();
        ring.appendChild(img);
        if (!bcheck()){
            newringlist.push(ring);
        }
        document.getElementById(id).appendChild(img);
        ring.appendChild(oldimg);
        oldimg.addEventListener("dragstart", dragstart);
        oldimg.addEventListener("dragend", dragend);
    }
    changeturn();
    resetboard();
    if (img.classList.contains("wpawn")){
        return [newdotlist, newringlist];
    }
    for (let dot of newdotlist){
        dot.getElementsByClassName("dot")[0].style.display = "inline-block";
        dot.addEventListener("click", move);
    }
    for (let ring of newringlist){
        ring.getElementsByClassName("ring")[0].style.display = "inline-block";
        ring.addEventListener("click", eat);
    }
    document.getElementById(id).style.backgroundColor = "yellow";
}

function check_valid_moves_black(id){
    let squares = document.getElementsByClassName("grid-item");
    let dotlist = [];
    let ringlist = [];
    for (let i = 0; i < squares.length; i++){
        if (squares[i].getElementsByClassName("dot")[0].style.display == "inline-block"){
            dotlist.push(squares[i]);
        }
        if (squares[i].getElementsByClassName("ring")[0].style.display == "inline-block"){
            ringlist.push(squares[i]);
        }
    }
    let img = document.getElementById(id).getElementsByTagName("img")[0];
    changeturn();
    resetboard();
    let newdotlist = [];
    let newringlist = [];
    for (let dot of dotlist){
        dot.appendChild(img);
        if (!wcheck()){
            newdotlist.push(dot);
        }
        document.getElementById(id).appendChild(img);
    }
    for (let ring of ringlist){
        let oldimg = ring.getElementsByTagName("img")[0].cloneNode(true);
        ring.getElementsByTagName("img")[0].remove();
        ring.appendChild(img);
        if (!wcheck()){
            newringlist.push(ring);
        }
        document.getElementById(id).appendChild(img);
        ring.appendChild(oldimg);
        oldimg.addEventListener("dragstart", dragstart);
        oldimg.addEventListener("dragend", dragend);
    }
    changeturn();
    resetboard();
    if (img.classList.contains("bpawn")){
        return [newdotlist, newringlist];
    }
    for (let dot of newdotlist){
        dot.getElementsByClassName("dot")[0].style.display = "inline-block";
        dot.addEventListener("click", move);
    }
    for (let ring of newringlist){
        ring.getElementsByClassName("ring")[0].style.display = "inline-block";
        ring.addEventListener("click", eat);
    }
    document.getElementById(id).style.backgroundColor = "yellow";
}

function check_for_check_after_turn(){
    if ((turn == 0 && wcheck()) || (turn == 1 && bcheck())){
        document.getElementById("check").style.display = "inline";
        document.getElementById("check").innerHTML = "Check!";
        return true;
    }
    else{
        document.getElementById("check").style.display = "";
        return false;
    }
}

function changeturn(){
    if (turn == 0){
        turn = 1;
        document.getElementById("h").innerHTML = "Black's turn";
    }
    else{
        turn = 0;
        document.getElementById("h").innerHTML = "White's turn";
    }
}

function freezeboard(){
    let squares = document.getElementsByClassName("grid-item");
    for (let i = 0; i < squares.length; i++){
        squares[i].style.backgroundColor = "white";
        squares[i].getElementsByClassName("dot")[0].style.display = "";
        squares[i].getElementsByClassName("ring")[0].style.display = "";
        squares[i].removeEventListener("click", move);
        squares[i].removeEventListener("click", eat);
        squares[i].removeEventListener("click", select);
    }
    let grays = document.getElementsByClassName("gray");
    for (let i = 0; i < grays.length; i++){
        grays[i].style.backgroundColor = "lightgray";
    }
    let pieces = document.getElementsByClassName("draggable");
    for (let piece of pieces){
        piece.removeEventListener("dragstart", dragstart);
    }
}

function check_mate(){
    let squares = document.getElementsByClassName("grid-item");
    if (turn == 0){
        changeturn();
        resetboard();
        let blacks = document.getElementsByClassName("b");
        for (let black of blacks){
            black.parentElement.click();
            for (let square of squares){
                if (square.getElementsByClassName("ring")[0].style.display != ""
                || square.getElementsByClassName("dot")[0].style.display != ""){
                    changeturn();
                    return false;
                }
            }
        }
        changeturn();
        freezeboard();
        return true;
    }
    else{
        changeturn();
        resetboard();
        let whites = document.getElementsByClassName("w");
        for (let white of whites){
            white.parentElement.click();
            for (let square of squares){
                if (square.getElementsByClassName("ring")[0].style.display != ""
                || square.getElementsByClassName("dot")[0].style.display != ""){
                    changeturn();
                    return false;
                }
            }
        }
        changeturn();
        freezeboard();
        return true;
    }
}

function remove_unmoved(piece){
    if (piece.classList.contains("unmoved")){
        piece.classList.remove("unmoved");
    }
}

function remove_twostep(){
    let wpawns = document.getElementsByClassName("wpawn");
    let bpawns = document.getElementsByClassName("bpawn");
    for (let wpawn of wpawns){
        if (wpawn.classList.contains("twostep")){
            wpawn.classList.remove("twostep");
        }
    }
    for (let bpawn of bpawns){
        if (bpawn.classList.contains("twostep")){
            bpawn.classList.remove("twostep");
        }
    }
}

function promotion(){
    for (let i = 1; i < 9; i++){
        if ((document.getElementById("r1c"+i).getElementsByClassName("wpawn").length > 0 && turn == 0)
        || document.getElementById("r8c"+i).getElementsByClassName("bpawn").length > 0 && turn == 1){
            document.getElementById("check").innerHTML = "Promotion!";
            document.getElementById("check").style.display = "inline";
            document.getElementById("promo").style.display = "block";
            return true;
        }
    }
    return false;
}

function endturn(){
    if (promotion()){
        freezeboard();
    }
    else{
        endturnchecks();
    }
}

function endturnchecks(){
    if (check_for_check_after_turn()){
        if (check_mate() && turn == 0){
            document.getElementById("check").style.display = "inline";
            document.getElementById("check").innerHTML = "Checkmate!";
            document.getElementById("h").innerHTML = "Game over. White wins!";
            return;
        }
        if (check_mate() && turn == 1){
            document.getElementById("check").style.display = "inline";
            document.getElementById("check").innerHTML = "Checkmate!";
            document.getElementById("h").innerHTML = "Game over. Black wins!";
            return;
        }
    }
    else if (check_mate()){
        document.getElementById("check").style.display = "inline";
        document.getElementById("check").innerHTML = "Stalemate.";
        document.getElementById("h").innerHTML = "Game over. Draw.";
        return;
    }
    changeturn();
    resetboard();
}

function drop(ev) {
    ev.preventDefault();
    let img = undefined;
    let original_id = undefined;
    let squares = document.getElementsByClassName("grid-item");
    for (let i = 0; i < squares.length; i++){
        if (squares[i].style.backgroundColor == "yellow"){
            img = squares[i].getElementsByTagName("img")[0];
            original_id = squares[i].id;
        }
    }
    var data = ev.dataTransfer.getData("text");
    if (this.style.backgroundColor == "cyan"){
        remove_twostep();
        if (img.parentElement.id == "r8c1"){
            document.getElementById("r8c4").appendChild(img);
            document.getElementById("r8c3").appendChild(document.getElementById("wking"));
            remove_unmoved(document.getElementById("wking"));
        }
        else if (img.parentElement.id == "r8c8"){
            document.getElementById("r8c6").appendChild(img);
            document.getElementById("r8c7").appendChild(document.getElementById("wking"));
            remove_unmoved(document.getElementById("wking"));
        }
        else if (img.parentElement.id == "r8c5"){
            if (this.id == "r8c1"){
                remove_unmoved(this.getElementsByTagName("img")[0]);
                document.getElementById("r8c4").appendChild(this.getElementsByTagName("img")[0]);
                document.getElementById("r8c3").appendChild(img);
            }
            else{
                remove_unmoved(this.getElementsByTagName("img")[0]);
                document.getElementById("r8c6").appendChild(this.getElementsByTagName("img")[0]);
                document.getElementById("r8c7").appendChild(img);
            }
        }
        else if (img.parentElement.id == "r1c1"){
            document.getElementById("r1c4").appendChild(img);
            document.getElementById("r1c3").appendChild(document.getElementById("bking"));
            remove_unmoved(document.getElementById("bking"));
        }
        else if (img.parentElement.id == "r1c8"){
            document.getElementById("r1c6").appendChild(img);
            document.getElementById("r1c7").appendChild(document.getElementById("bking"));
            remove_unmoved(document.getElementById("bking"));
        }
        else{
            if (this.id == "r1c1"){
                remove_unmoved(this.getElementsByTagName("img")[0]);
                document.getElementById("r1c4").appendChild(this.getElementsByTagName("img")[0]);
                document.getElementById("r1c3").appendChild(img);
            }
            else{
                remove_unmoved(this.getElementsByTagName("img")[0]);
                document.getElementById("r1c6").appendChild(this.getElementsByTagName("img")[0]);
                document.getElementById("r1c7").appendChild(img);
            }
        }
    }
    else if (this.getElementsByClassName("twostep").length > 0 && turn == 0 && original_id[1] == "4"){
        this.getElementsByClassName("twostep")[0].remove();
        let r = Number(this.id[1]);
        let c = this.id.slice(2, 4);
        document.getElementById("r"+(r-1)+c).appendChild(img);
    }
    else if (this.getElementsByClassName("twostep").length > 0 && turn == 1 && original_id[1] == "5"){
        this.getElementsByClassName("twostep")[0].remove();
        let r = Number(this.id[1]);
        let c = this.id.slice(2, 4);
        document.getElementById("r"+(r+1)+c).appendChild(img);
    }
    else{
        remove_twostep();
        if (this.getElementsByTagName("img").length > 0){
            this.getElementsByTagName("img")[0].remove();
        }
        this.appendChild(document.getElementById(data));
        if ((original_id[1] == "7" && this.id[1] == "5" && img.classList.contains("wpawn"))
        || (original_id[1] == "2" && this.id[1] == "4" && img.classList.contains("bpawn"))){
            img.classList.add("twostep");
        }
    }
    remove_unmoved(document.getElementById(data));
    resetboard();
    endturn();
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragstart(ev) {
    ev.dataTransfer.setData("text", this.id);
    this.style.opacity = 0;
    if (this.parentElement.style.backgroundColor != "yellow"){
        this.parentElement.click();
    }
    let squares = document.getElementsByClassName("grid-item");
    for (let i = 0; i < squares.length; i++){
        if (squares[i].getElementsByClassName("dot")[0].style.display == "inline-block"
        || squares[i].getElementsByClassName("ring")[0].style.display == "inline-block"
        || squares[i].style.backgroundColor == "cyan"){
            squares[i].addEventListener("dragover", allowDrop);
            squares[i].addEventListener("drop", drop);
        }
    }
}

function dragend() {
    let squares = document.getElementsByClassName("grid-item");
    for (let i = 0; i < squares.length; i++){
        if (squares[i].getElementsByClassName("draggable").length > 0){
            squares[i].getElementsByClassName("draggable")[0].style.opacity = 1;
        }
        squares[i].removeEventListener("dragover", allowDrop);
        squares[i].removeEventListener("drop", drop);
    }
}

function move(){
    remove_twostep();
    let img = undefined;
    let original_id = undefined;
    let squares = document.getElementsByClassName("grid-item");
    for (let i = 0; i < squares.length; i++){
        if (squares[i].style.backgroundColor == "yellow"){
            img = squares[i].getElementsByTagName("img")[0];
            original_id = squares[i].id;
        }
    }
    if (this.style.backgroundColor == "cyan"){
        if (img.parentElement.id == "r8c1"){
            document.getElementById("r8c4").appendChild(img);
            document.getElementById("r8c3").appendChild(document.getElementById("wking"));
            remove_unmoved(document.getElementById("wking"));
        }
        else if (img.parentElement.id == "r8c8"){
            document.getElementById("r8c6").appendChild(img);
            document.getElementById("r8c7").appendChild(document.getElementById("wking"));
            remove_unmoved(document.getElementById("wking"));
        }
        else if (img.parentElement.id == "r8c5"){
            if (this.id == "r8c1"){
                remove_unmoved(this.getElementsByTagName("img")[0]);
                document.getElementById("r8c4").appendChild(this.getElementsByTagName("img")[0]);
                document.getElementById("r8c3").appendChild(img);
            }
            else{
                remove_unmoved(this.getElementsByTagName("img")[0]);
                document.getElementById("r8c6").appendChild(this.getElementsByTagName("img")[0]);
                document.getElementById("r8c7").appendChild(img);
            }
        }
        else if (img.parentElement.id == "r1c1"){
            document.getElementById("r1c4").appendChild(img);
            document.getElementById("r1c3").appendChild(document.getElementById("bking"));
            remove_unmoved(document.getElementById("bking"));
        }
        else if (img.parentElement.id == "r1c8"){
            document.getElementById("r1c6").appendChild(img);
            document.getElementById("r1c7").appendChild(document.getElementById("bking"));
            remove_unmoved(document.getElementById("bking"));
        }
        else{
            if (this.id == "r1c1"){
                remove_unmoved(this.getElementsByTagName("img")[0]);
                document.getElementById("r1c4").appendChild(this.getElementsByTagName("img")[0]);
                document.getElementById("r1c3").appendChild(img);
            }
            else{
                remove_unmoved(this.getElementsByTagName("img")[0]);
                document.getElementById("r1c6").appendChild(this.getElementsByTagName("img")[0]);
                document.getElementById("r1c7").appendChild(img);
            }
        }
    }
    else{
        this.appendChild(img);
        if ((original_id[1] == "7" && this.id[1] == "5" && img.classList.contains("wpawn"))
        || (original_id[1] == "2" && this.id[1] == "4" && img.classList.contains("bpawn"))){
            img.classList.add("twostep");
        }
    }
    remove_unmoved(img);
    resetboard();
    endturn();
}

function eat(){
    let img = undefined;
    let original_id = undefined;
    let squares = document.getElementsByClassName("grid-item");
    for (let i = 0; i < squares.length; i++){
        if (squares[i].style.backgroundColor == "yellow"){
            img = squares[i].getElementsByTagName("img")[0];
            original_id = squares[i].id;
        }
    }
    if (this.getElementsByClassName("twostep").length > 0 && turn == 0 && original_id[1] == "4"){
        this.getElementsByClassName("twostep")[0].remove();
        let r = Number(this.id[1]);
        let c = this.id.slice(2, 4);
        document.getElementById("r"+(r-1)+c).appendChild(img);
    }
    else if (this.getElementsByClassName("twostep").length > 0 && turn == 1 && original_id[1] == "5"){
        this.getElementsByClassName("twostep")[0].remove();
        let r = Number(this.id[1]);
        let c = this.id.slice(2, 4);
        document.getElementById("r"+(r+1)+c).appendChild(img);
    }
    else{
        this.getElementsByTagName("img")[0].remove();
        this.appendChild(img);
    }
    remove_twostep();
    remove_unmoved(img);
    resetboard();
    endturn();
}

function resetboard(){
    let squares = document.getElementsByClassName("grid-item");
    for (let i = 0; i < squares.length; i++){
        squares[i].style.backgroundColor = "white";
        squares[i].getElementsByClassName("dot")[0].style.display = "";
        squares[i].getElementsByClassName("ring")[0].style.display = "";
        squares[i].removeEventListener("click", move);
        squares[i].removeEventListener("click", eat);
        squares[i].removeEventListener("click", select);
        if (turn == 0 && squares[i].getElementsByClassName("w").length > 0){
            squares[i].addEventListener("click", select);
        }
        if (turn == 1 && squares[i].getElementsByClassName("b").length > 0){
            squares[i].addEventListener("click", select);
        }
    }
    let grays = document.getElementsByClassName("gray");
    for (let i = 0; i < grays.length; i++){
        grays[i].style.backgroundColor = "lightgray";
    }
}

function select(){
    if (this.style.backgroundColor == "yellow"){
        resetboard();
        return;
    }
    resetboard();
    this.style.backgroundColor = "yellow";
    if (this.getElementsByClassName("wrook").length > 0){
        wrook(this.id);
    }
    if (this.getElementsByClassName("brook").length > 0){
        brook(this.id);
    }
    if (this.getElementsByClassName("wknight").length > 0){
        wknight(this.id);
    }
    if (this.getElementsByClassName("bknight").length > 0){
        bknight(this.id);
    }
    if (this.getElementsByClassName("wbishop").length > 0){
        wbishop(this.id);
    }
    if (this.getElementsByClassName("bbishop").length > 0){
        bbishop(this.id);
    }
    if (this.getElementsByClassName("wqueen").length > 0){
        wqueen(this.id);
    }
    if (this.getElementsByClassName("bqueen").length > 0){
        bqueen(this.id);
    }
    if (this.contains(document.getElementById("wking"))){
        wking(this.id);
    }
    if (this.contains(document.getElementById("bking"))){
        bking(this.id);
    }
    if (this.getElementsByClassName("wpawn").length > 0){
        wpawn(this.id);
    }
    if (this.getElementsByClassName("bpawn").length > 0){
        bpawn(this.id);
    }
}

function wrook(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let castling = false;
    // check for castling
    if (document.getElementById("wking").classList.contains("unmoved") 
    && document.getElementById(id).getElementsByTagName("img")[0].classList.contains("unmoved")){
        // check if left or right rook
        if (c == 1){
            // left rook
            let filled_squares = 0;
            for (let i = 2; i < 5; i++){
                if (document.getElementById("r"+r+"c"+i).children.length > 2){
                    filled_squares++;
                    break;
                }
            }
            if (filled_squares == 0 && !bcheck()){
                let squares_under_attack = 0;
                for (let i = 2; i < 5; i++){
                    document.getElementById("r"+r+"c"+i).appendChild(document.getElementById("wking"));
                    if (bcheck()){
                        squares_under_attack++;
                        break;
                    }
                }
                document.getElementById("r8c5").appendChild(document.getElementById("wking"));
                if (squares_under_attack == 0){
                    castling = true;
                }
            }
        }
        else{
            // right rook
            let filled_squares = 0;
            for (let i = 6; i < 8; i++){
                if (document.getElementById("r"+r+"c"+i).children.length > 2){
                    filled_squares++;
                    break;
                }
            }
            if (filled_squares == 0 && !bcheck()){
                let squares_under_attack = 0;
                for (let i = 6; i < 8; i++){
                    document.getElementById("r"+r+"c"+i).appendChild(document.getElementById("wking"));
                    if (bcheck()){
                        squares_under_attack++;
                        break;
                    }
                }
                document.getElementById("r8c5").appendChild(document.getElementById("wking"));
                if (squares_under_attack == 0){
                    castling = true;
                }
            }
        }
    }
    for (let i = r - 1; i > 0; i--){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("b").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = r + 1; i < 9; i++){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("b").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c - 1; i > 0; i--){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("b").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c + 1; i < 9; i++){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("b").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    check_valid_moves_white(id);
    if (castling){
        document.getElementById("r8c5").style.backgroundColor = "cyan";
        document.getElementById("r8c5").removeEventListener("click", select);
        document.getElementById("r8c5").addEventListener("click", move);
    }
}

function brook(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let castling = false;
    // check for castling
    if (document.getElementById("bking").classList.contains("unmoved") 
    && document.getElementById(id).getElementsByTagName("img")[0].classList.contains("unmoved")){
        // check if left or right rook
        if (c == 1){
            // left rook
            let filled_squares = 0;
            for (let i = 2; i < 5; i++){
                if (document.getElementById("r"+r+"c"+i).children.length > 2){
                    filled_squares++;
                    break;
                }
            }
            if (filled_squares == 0 && !wcheck()){
                let squares_under_attack = 0;
                for (let i = 2; i < 5; i++){
                    document.getElementById("r"+r+"c"+i).appendChild(document.getElementById("bking"));
                    if (wcheck()){
                        squares_under_attack++;
                        break;
                    }
                }
                document.getElementById("r1c5").appendChild(document.getElementById("bking"));
                if (squares_under_attack == 0){
                    castling = true;
                }
            }
        }
        else{
            // right rook
            let filled_squares = 0;
            for (let i = 6; i < 8; i++){
                if (document.getElementById("r"+r+"c"+i).children.length > 2){
                    filled_squares++;
                    break;
                }
            }
            if (filled_squares == 0 && !wcheck()){
                let squares_under_attack = 0;
                for (let i = 6; i < 8; i++){
                    document.getElementById("r"+r+"c"+i).appendChild(document.getElementById("bking"));
                    if (wcheck()){
                        squares_under_attack++;
                        break;
                    }
                }
                document.getElementById("r1c5").appendChild(document.getElementById("bking"));
                if (squares_under_attack == 0){
                    castling = true;
                }
            }
        }
    }
    for (let i = r - 1; i > 0; i--){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("w").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = r + 1; i < 9; i++){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("w").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c - 1; i > 0; i--){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("w").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c + 1; i < 9; i++){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("w").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    check_valid_moves_black(id);
    if (castling){
        document.getElementById("r1c5").style.backgroundColor = "cyan";
        document.getElementById("r1c5").removeEventListener("click", select);
        document.getElementById("r1c5").addEventListener("click", move);
    }
}

function wknight(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let p1 = [document.getElementById("r"+(r+2)+"c"+(c+1)), r+2, c+1];
    let p2 = [document.getElementById("r"+(r+2)+"c"+(c-1)), r+2, c-1];
    let p3 = [document.getElementById("r"+(r+1)+"c"+(c+2)), r+1, c+2];
    let p4 = [document.getElementById("r"+(r+1)+"c"+(c-2)), r+1, c-2];
    let p5 = [document.getElementById("r"+(r-1)+"c"+(c+2)), r-1, c+2];
    let p6 = [document.getElementById("r"+(r-1)+"c"+(c-2)), r-1, c-2];
    let p7 = [document.getElementById("r"+(r-2)+"c"+(c+1)), r-2, c+1];
    let p8 = [document.getElementById("r"+(r-2)+"c"+(c-1)), r-2, c-1];
    let plist = [p1, p2, p3, p4, p5, p6, p7, p8];
    let newplist = []
    for (let p of plist){
        if (p[1] > 0 && p[1] < 9 && p[2] > 0 && p[2] < 9){
            newplist.push(p);
        }
    }
    for (let p of newplist){
        if (p[0].children.length < 3){
            p[0].getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (p[0].getElementsByClassName("b").length > 0){
            p[0].getElementsByClassName("ring")[0].style.display = "inline-block";
        }
    }
    check_valid_moves_white(id);
}

function bknight(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let p1 = [document.getElementById("r"+(r+2)+"c"+(c+1)), r+2, c+1];
    let p2 = [document.getElementById("r"+(r+2)+"c"+(c-1)), r+2, c-1];
    let p3 = [document.getElementById("r"+(r+1)+"c"+(c+2)), r+1, c+2];
    let p4 = [document.getElementById("r"+(r+1)+"c"+(c-2)), r+1, c-2];
    let p5 = [document.getElementById("r"+(r-1)+"c"+(c+2)), r-1, c+2];
    let p6 = [document.getElementById("r"+(r-1)+"c"+(c-2)), r-1, c-2];
    let p7 = [document.getElementById("r"+(r-2)+"c"+(c+1)), r-2, c+1];
    let p8 = [document.getElementById("r"+(r-2)+"c"+(c-1)), r-2, c-1];
    let plist = [p1, p2, p3, p4, p5, p6, p7, p8];
    let newplist = []
    for (let p of plist){
        if (p[1] > 0 && p[1] < 9 && p[2] > 0 && p[2] < 9){
            newplist.push(p);
        }
    }
    for (let p of newplist){
        if (p[0].children.length < 3){
            p[0].getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (p[0].getElementsByClassName("w").length > 0){
            p[0].getElementsByClassName("ring")[0].style.display = "inline-block";
        }
    }
    check_valid_moves_black(id);
}

function wbishop(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c + i < 9){
            if (document.getElementById("r"+(r+i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c - i > 0){
            if (document.getElementById("r"+(r+i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c + i < 9){
            if (document.getElementById("r"+(r-i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c - i > 0){
            if (document.getElementById("r"+(r-i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    check_valid_moves_white(id);
}

function bbishop(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c + i < 9){
            if (document.getElementById("r"+(r+i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c - i > 0){
            if (document.getElementById("r"+(r+i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c + i < 9){
            if (document.getElementById("r"+(r-i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c - i > 0){
            if (document.getElementById("r"+(r-i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    check_valid_moves_black(id);
}

function wqueen(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    for (let i = r - 1; i > 0; i--){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("b").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = r + 1; i < 9; i++){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("b").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c - 1; i > 0; i--){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("b").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c + 1; i < 9; i++){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("b").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c + i < 9){
            if (document.getElementById("r"+(r+i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c - i > 0){
            if (document.getElementById("r"+(r+i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c + i < 9){
            if (document.getElementById("r"+(r-i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c - i > 0){
            if (document.getElementById("r"+(r-i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    check_valid_moves_white(id);
}

function bqueen(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    for (let i = r - 1; i > 0; i--){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("w").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = r + 1; i < 9; i++){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("w").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c - 1; i > 0; i--){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("w").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c + 1; i < 9; i++){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("w").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c + i < 9){
            if (document.getElementById("r"+(r+i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c - i > 0){
            if (document.getElementById("r"+(r+i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c + i < 9){
            if (document.getElementById("r"+(r-i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c - i > 0){
            if (document.getElementById("r"+(r-i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    check_valid_moves_black(id);
}

function wking(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let castlingleft = false;
    let castlingright = false;
    if (document.getElementById("wking").classList.contains("unmoved") && !bcheck()){
        if (document.getElementById("r8c1").getElementsByClassName("wrook").length > 0){
            if (document.getElementById("r8c1").getElementsByClassName("wrook")[0].classList.contains("unmoved")){
                let left_filled_squares = 0;
                for (let i = 2; i < 5; i++){
                    if (document.getElementById("r"+r+"c"+i).children.length > 2){
                        left_filled_squares++;
                        break;
                    }
                }
                if (left_filled_squares == 0){
                    let squares_under_attack = 0;
                    for (let i = 2; i < 5; i++){
                        document.getElementById("r"+r+"c"+i).appendChild(document.getElementById("wking"));
                        if (bcheck()){
                            squares_under_attack++;
                            break;
                        }
                    }
                    document.getElementById("r8c5").appendChild(document.getElementById("wking"));
                    if (squares_under_attack == 0){
                        castlingleft = true;
                    }
                }
            }
        }
        if (document.getElementById("r8c8").getElementsByClassName("wrook").length > 0){
            if (document.getElementById("r8c8").getElementsByClassName("wrook")[0].classList.contains("unmoved")){
                let right_filled_squares = 0;
                for (let i = 6; i < 8; i++){
                    if (document.getElementById("r"+r+"c"+i).children.length > 2){
                        right_filled_squares++;
                        break;
                    }
                }
                if (right_filled_squares == 0){
                    let squares_under_attack = 0;
                    for (let i = 6; i < 8; i++){
                        document.getElementById("r"+r+"c"+i).appendChild(document.getElementById("wking"));
                        if (bcheck()){
                            squares_under_attack++;
                            break;
                        }
                    }
                    document.getElementById("r8c5").appendChild(document.getElementById("wking"));
                    if (squares_under_attack == 0){
                        castlingright = true;
                    }
                }
            }
        }
    }
    let p1 = [document.getElementById("r"+(r-1)+"c"+(c)), r-1, c];
    let p2 = [document.getElementById("r"+(r-1)+"c"+(c+1)), r-1, c+1];
    let p3 = [document.getElementById("r"+(r)+"c"+(c+1)), r, c+1];
    let p4 = [document.getElementById("r"+(r+1)+"c"+(c+1)), r+1, c+1];
    let p5 = [document.getElementById("r"+(r+1)+"c"+(c)), r+1, c];
    let p6 = [document.getElementById("r"+(r+1)+"c"+(c-1)), r+1, c-1];
    let p7 = [document.getElementById("r"+(r)+"c"+(c-1)), r, c-1];
    let p8 = [document.getElementById("r"+(r-1)+"c"+(c-1)), r-1, c-1];
    let plist = [p1, p2, p3, p4, p5, p6, p7, p8];
    let newplist = []
    for (let p of plist){
        if (p[1] > 0 && p[1] < 9 && p[2] > 0 && p[2] < 9){
            newplist.push(p);
        }
    }
    for (let p of newplist){
        if (p[0].children.length < 3){
            p[0].getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (p[0].getElementsByClassName("b").length > 0){
            p[0].getElementsByClassName("ring")[0].style.display = "inline-block";
        }
    }
    check_valid_moves_white(id);
    if (castlingleft){
        document.getElementById("r8c1").style.backgroundColor = "cyan";
        document.getElementById("r8c1").removeEventListener("click", select);
        document.getElementById("r8c1").addEventListener("click", move);
    }
    if (castlingright){
        document.getElementById("r8c8").style.backgroundColor = "cyan";
        document.getElementById("r8c8").removeEventListener("click", select);
        document.getElementById("r8c8").addEventListener("click", move);
    }
}

function bking(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let castlingleft = false;
    let castlingright = false;
    if (document.getElementById("bking").classList.contains("unmoved") && !wcheck()){
        if (document.getElementById("r1c1").getElementsByClassName("brook").length > 0){
            if (document.getElementById("r1c1").getElementsByClassName("brook")[0].classList.contains("unmoved")){
                let left_filled_squares = 0;
                for (let i = 2; i < 5; i++){
                    if (document.getElementById("r"+r+"c"+i).children.length > 2){
                        left_filled_squares++;
                        break;
                    }
                }
                if (left_filled_squares == 0){
                    let squares_under_attack = 0;
                    for (let i = 2; i < 5; i++){
                        document.getElementById("r"+r+"c"+i).appendChild(document.getElementById("bking"));
                        if (wcheck()){
                            squares_under_attack++;
                            break;
                        }
                    }
                    document.getElementById("r1c5").appendChild(document.getElementById("bking"));
                    if (squares_under_attack == 0){
                        castlingleft = true;
                    }
                }
            }
        }
        if (document.getElementById("r1c8").getElementsByClassName("brook").length > 0){
            if (document.getElementById("r1c8").getElementsByClassName("brook")[0].classList.contains("unmoved")){
                let right_filled_squares = 0;
                for (let i = 6; i < 8; i++){
                    if (document.getElementById("r"+r+"c"+i).children.length > 2){
                        right_filled_squares++;
                        break;
                    }
                }
                if (right_filled_squares == 0){
                    let squares_under_attack = 0;
                    for (let i = 6; i < 8; i++){
                        document.getElementById("r"+r+"c"+i).appendChild(document.getElementById("bking"));
                        if (wcheck()){
                            squares_under_attack++;
                            break;
                        }
                    }
                    document.getElementById("r1c5").appendChild(document.getElementById("bking"));
                    if (squares_under_attack == 0){
                        castlingright = true;
                    }
                }
            }
        }
    }
    let p1 = [document.getElementById("r"+(r-1)+"c"+(c)), r-1, c];
    let p2 = [document.getElementById("r"+(r-1)+"c"+(c+1)), r-1, c+1];
    let p3 = [document.getElementById("r"+(r)+"c"+(c+1)), r, c+1];
    let p4 = [document.getElementById("r"+(r+1)+"c"+(c+1)), r+1, c+1];
    let p5 = [document.getElementById("r"+(r+1)+"c"+(c)), r+1, c];
    let p6 = [document.getElementById("r"+(r+1)+"c"+(c-1)), r+1, c-1];
    let p7 = [document.getElementById("r"+(r)+"c"+(c-1)), r, c-1];
    let p8 = [document.getElementById("r"+(r-1)+"c"+(c-1)), r-1, c-1];
    let plist = [p1, p2, p3, p4, p5, p6, p7, p8];
    let newplist = []
    for (let p of plist){
        if (p[1] > 0 && p[1] < 9 && p[2] > 0 && p[2] < 9){
            newplist.push(p);
        }
    }
    for (let p of newplist){
        if (p[0].children.length < 3){
            p[0].getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (p[0].getElementsByClassName("w").length > 0){
            p[0].getElementsByClassName("ring")[0].style.display = "inline-block";
        }
    }
    check_valid_moves_black(id);
    if (castlingleft){
        document.getElementById("r1c1").style.backgroundColor = "cyan";
        document.getElementById("r1c1").removeEventListener("click", select);
        document.getElementById("r1c1").addEventListener("click", move);
    }
    if (castlingright){
        document.getElementById("r1c8").style.backgroundColor = "cyan";
        document.getElementById("r1c8").removeEventListener("click", select);
        document.getElementById("r1c8").addEventListener("click", move);
    }
}

function wpawn(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let p1 = document.getElementById("r"+(r-1)+"c"+c);
    let p2 = document.getElementById("r"+(r-2)+"c"+c);
    let plist = []
    if (r == 7){
        plist = [p1, p2];
    }
    else if (r == 1){
        plist = [];
    }
    else{
        plist = [p1];
    }
    for (let p of plist){
        if (p.children.length < 3){
            p.getElementsByClassName("dot")[0].style.display = "inline-block";
        }
    }
    let e1 = [document.getElementById("r"+(r-1)+"c"+(c-1)), r-1, c-1];
    let e2 = [document.getElementById("r"+(r-1)+"c"+(c+1)), r-1, c+1];
    let elist = [e1, e2];
    let newelist = [];
    for (let e of elist){
        if (e[1] > 0 && e[2] > 0 && e[2] < 9){
            newelist.push(e);
        }
    }
    for (let e of newelist){
        if (e[0].getElementsByClassName("b").length > 0){
            e[0].getElementsByClassName("ring")[0].style.display = "inline-block";
        }
    }
    let lists = check_valid_moves_white(id);
    let leftenpassant = false;
    let rightenpassant = false;
    // Check for en passant
    if (c > 1){
        // Check left
        if (document.getElementById("r"+r+"c"+(c-1)).getElementsByClassName("twostep").length > 0){
            let oldimg = document.getElementById("r"+r+"c"+(c-1)).getElementsByClassName("twostep")[0].cloneNode(false);
            document.getElementById("r"+r+"c"+(c-1)).getElementsByClassName("twostep")[0].remove();
            document.getElementById("r"+(r-1)+"c"+(c-1)).appendChild(document.getElementById(id).getElementsByTagName("img")[0]);
            if (!bcheck()){
                leftenpassant = true;
            }
            document.getElementById(id).appendChild(document.getElementById("r"+(r-1)+"c"+(c-1)).getElementsByTagName("img")[0]);
            document.getElementById("r"+r+"c"+(c-1)).appendChild(oldimg);
        }
    }
    if (c < 8){
        // Check right
        if (document.getElementById("r"+r+"c"+(c+1)).getElementsByClassName("twostep").length > 0){
            let oldimg = document.getElementById("r"+r+"c"+(c+1)).getElementsByClassName("twostep")[0].cloneNode(false);
            document.getElementById("r"+r+"c"+(c+1)).getElementsByClassName("twostep")[0].remove();
            document.getElementById("r"+(r-1)+"c"+(c+1)).appendChild(document.getElementById(id).getElementsByTagName("img")[0]);
            if (!bcheck()){
                rightenpassant = true;
            }
            document.getElementById(id).appendChild(document.getElementById("r"+(r-1)+"c"+(c+1)).getElementsByTagName("img")[0]);
            document.getElementById("r"+r+"c"+(c+1)).appendChild(oldimg);
        }
    }
    resetboard();
    if (leftenpassant){
        lists[1].push(document.getElementById("r"+r+"c"+(c-1)));
    }
    if (rightenpassant){
        lists[1].push(document.getElementById("r"+r+"c"+(c+1)));
    }
    for (let dot of lists[0]){
        dot.getElementsByClassName("dot")[0].style.display = "inline-block";
        dot.addEventListener("click", move);
    }
    for (let ring of lists[1]){
        ring.getElementsByClassName("ring")[0].style.display = "inline-block";
        ring.addEventListener("click", eat);
    }
    document.getElementById(id).style.backgroundColor = "yellow";
}

function bpawn(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let p1 = document.getElementById("r"+(r+1)+"c"+c);
    let p2 = document.getElementById("r"+(r+2)+"c"+c);
    let plist = []
    if (r == 2){
        plist = [p1, p2];
    }
    else if (r == 8){
        plist = [];
    }
    else{
        plist = [p1];
    }
    for (let p of plist){
        if (p.children.length < 3){
            p.getElementsByClassName("dot")[0].style.display = "inline-block";
        }
    }
    let e1 = [document.getElementById("r"+(r+1)+"c"+(c-1)), r+1, c-1];
    let e2 = [document.getElementById("r"+(r+1)+"c"+(c+1)), r+1, c+1];
    let elist = [e1, e2];
    let newelist = [];
    for (let e of elist){
        if (e[1] < 9 && e[2] > 0 && e[2] < 9){
            newelist.push(e);
        }
    }
    for (let e of newelist){
        if (e[0].getElementsByClassName("w").length > 0){
            e[0].getElementsByClassName("ring")[0].style.display = "inline-block";
        }
    }
    let lists = check_valid_moves_black(id);
    let leftenpassant = false;
    let rightenpassant = false;
    // Check for en passant
    if (c > 1){
        // Check left
        if (document.getElementById("r"+r+"c"+(c-1)).getElementsByClassName("twostep").length > 0){
            let oldimg = document.getElementById("r"+r+"c"+(c-1)).getElementsByClassName("twostep")[0].cloneNode(false);
            document.getElementById("r"+r+"c"+(c-1)).getElementsByClassName("twostep")[0].remove();
            document.getElementById("r"+(r+1)+"c"+(c-1)).appendChild(document.getElementById(id).getElementsByTagName("img")[0]);
            if (!wcheck()){
                leftenpassant = true;
            }
            document.getElementById(id).appendChild(document.getElementById("r"+(r+1)+"c"+(c-1)).getElementsByTagName("img")[0]);
            document.getElementById("r"+r+"c"+(c-1)).appendChild(oldimg);
        }
    }
    if (c < 8){
        // Check right
        if (document.getElementById("r"+r+"c"+(c+1)).getElementsByClassName("twostep").length > 0){
            let oldimg = document.getElementById("r"+r+"c"+(c+1)).getElementsByClassName("twostep")[0].cloneNode(false);
            document.getElementById("r"+r+"c"+(c+1)).getElementsByClassName("twostep")[0].remove();
            document.getElementById("r"+(r+1)+"c"+(c+1)).appendChild(document.getElementById(id).getElementsByTagName("img")[0]);
            if (!wcheck()){
                rightenpassant = true;
            }
            document.getElementById(id).appendChild(document.getElementById("r"+(r+1)+"c"+(c+1)).getElementsByTagName("img")[0]);
            document.getElementById("r"+r+"c"+(c+1)).appendChild(oldimg);
        }
    }
    resetboard();
    if (leftenpassant){
        lists[1].push(document.getElementById("r"+r+"c"+(c-1)));
    }
    if (rightenpassant){
        lists[1].push(document.getElementById("r"+r+"c"+(c+1)));
    }
    for (let dot of lists[0]){
        dot.getElementsByClassName("dot")[0].style.display = "inline-block";
        dot.addEventListener("click", move);
    }
    for (let ring of lists[1]){
        ring.getElementsByClassName("ring")[0].style.display = "inline-block";
        ring.addEventListener("click", eat);
    }
    document.getElementById(id).style.backgroundColor = "yellow";
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function select_white(square){
    if (square.getElementsByClassName("wrook").length > 0){
        cwrook(square.id);
    }
    if (square.getElementsByClassName("wknight").length > 0){
        cwknight(square.id);
    }
    if (square.getElementsByClassName("wbishop").length > 0){
        cwbishop(square.id);
    }
    if (square.getElementsByClassName("wqueen").length > 0){
        cwqueen(square.id);
    }
    if (square.contains(document.getElementById("wking"))){
        cwking(square.id);
    }
    if (square.getElementsByClassName("wpawn").length > 0){
        cwpawn(square.id);
    }
}

function select_black(square){
    if (square.getElementsByClassName("brook").length > 0){
        cbrook(square.id);
    }
    if (square.getElementsByClassName("bknight").length > 0){
        cbknight(square.id);
    }
    if (square.getElementsByClassName("bbishop").length > 0){
        cbbishop(square.id);
    }
    if (square.getElementsByClassName("bqueen").length > 0){
        cbqueen(square.id);
    }
    if (square.contains(document.getElementById("bking"))){
        cbking(square.id);
    }
    if (square.getElementsByClassName("bpawn").length > 0){
        cbpawn(square.id);
    }
}

function cwrook(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    for (let i = r - 1; i > 0; i--){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("b").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = r + 1; i < 9; i++){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("b").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c - 1; i > 0; i--){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("b").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c + 1; i < 9; i++){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("b").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
}

function cbrook(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    for (let i = r - 1; i > 0; i--){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("w").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = r + 1; i < 9; i++){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("w").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c - 1; i > 0; i--){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("w").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c + 1; i < 9; i++){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("w").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
}

function cwknight(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let p1 = [document.getElementById("r"+(r+2)+"c"+(c+1)), r+2, c+1];
    let p2 = [document.getElementById("r"+(r+2)+"c"+(c-1)), r+2, c-1];
    let p3 = [document.getElementById("r"+(r+1)+"c"+(c+2)), r+1, c+2];
    let p4 = [document.getElementById("r"+(r+1)+"c"+(c-2)), r+1, c-2];
    let p5 = [document.getElementById("r"+(r-1)+"c"+(c+2)), r-1, c+2];
    let p6 = [document.getElementById("r"+(r-1)+"c"+(c-2)), r-1, c-2];
    let p7 = [document.getElementById("r"+(r-2)+"c"+(c+1)), r-2, c+1];
    let p8 = [document.getElementById("r"+(r-2)+"c"+(c-1)), r-2, c-1];
    let plist = [p1, p2, p3, p4, p5, p6, p7, p8];
    let newplist = []
    for (let p of plist){
        if (p[1] > 0 && p[1] < 9 && p[2] > 0 && p[2] < 9){
            newplist.push(p);
        }
    }
    for (let p of newplist){
        if (p[0].getElementsByClassName("b").length > 0){
            p[0].getElementsByClassName("ring")[0].style.display = "inline-block";
        }
    }
}

function cbknight(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let p1 = [document.getElementById("r"+(r+2)+"c"+(c+1)), r+2, c+1];
    let p2 = [document.getElementById("r"+(r+2)+"c"+(c-1)), r+2, c-1];
    let p3 = [document.getElementById("r"+(r+1)+"c"+(c+2)), r+1, c+2];
    let p4 = [document.getElementById("r"+(r+1)+"c"+(c-2)), r+1, c-2];
    let p5 = [document.getElementById("r"+(r-1)+"c"+(c+2)), r-1, c+2];
    let p6 = [document.getElementById("r"+(r-1)+"c"+(c-2)), r-1, c-2];
    let p7 = [document.getElementById("r"+(r-2)+"c"+(c+1)), r-2, c+1];
    let p8 = [document.getElementById("r"+(r-2)+"c"+(c-1)), r-2, c-1];
    let plist = [p1, p2, p3, p4, p5, p6, p7, p8];
    let newplist = []
    for (let p of plist){
        if (p[1] > 0 && p[1] < 9 && p[2] > 0 && p[2] < 9){
            newplist.push(p);
        }
    }
    for (let p of newplist){
        if (p[0].getElementsByClassName("w").length > 0){
            p[0].getElementsByClassName("ring")[0].style.display = "inline-block";
        }
    }
}

function cwbishop(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c + i < 9){
            if (document.getElementById("r"+(r+i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c - i > 0){
            if (document.getElementById("r"+(r+i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c + i < 9){
            if (document.getElementById("r"+(r-i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c - i > 0){
            if (document.getElementById("r"+(r-i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
}

function cbbishop(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c + i < 9){
            if (document.getElementById("r"+(r+i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c - i > 0){
            if (document.getElementById("r"+(r+i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c + i < 9){
            if (document.getElementById("r"+(r-i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c - i > 0){
            if (document.getElementById("r"+(r-i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
}

function cwqueen(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    for (let i = r - 1; i > 0; i--){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("b").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = r + 1; i < 9; i++){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("b").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c - 1; i > 0; i--){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("b").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c + 1; i < 9; i++){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("b").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c + i < 9){
            if (document.getElementById("r"+(r+i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c - i > 0){
            if (document.getElementById("r"+(r+i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c + i < 9){
            if (document.getElementById("r"+(r-i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c - i > 0){
            if (document.getElementById("r"+(r-i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("b").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
}

function cbqueen(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    for (let i = r - 1; i > 0; i--){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("w").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = r + 1; i < 9; i++){
        if (document.getElementById("r"+i+"c"+c).children.length < 3){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+i+"c"+c).getElementsByClassName("w").length > 0){
            document.getElementById("r"+i+"c"+c).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c - 1; i > 0; i--){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("w").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = c + 1; i < 9; i++){
        if (document.getElementById("r"+r+"c"+i).children.length < 3){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("dot")[0].style.display = "inline-block";
        }
        else if (document.getElementById("r"+r+"c"+i).getElementsByClassName("w").length > 0){
            document.getElementById("r"+r+"c"+i).getElementsByClassName("ring")[0].style.display = "inline-block";
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c + i < 9){
            if (document.getElementById("r"+(r+i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r + i < 9 && c - i > 0){
            if (document.getElementById("r"+(r+i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r+i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c + i < 9){
            if (document.getElementById("r"+(r-i)+"c"+(c+i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c+i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
    for (let i = 1; i < 9; i++){
        if (r - i > 0 && c - i > 0){
            if (document.getElementById("r"+(r-i)+"c"+(c-i)).children.length < 3){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("dot")[0].style.display = "inline-block";
            }
            else if (document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("w").length > 0){
                document.getElementById("r"+(r-i)+"c"+(c-i)).getElementsByClassName("ring")[0].style.display = "inline-block";
                break;
            }
            else{
                break;
            }
        }
    }
}

function cwking(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let p1 = [document.getElementById("r"+(r-1)+"c"+(c)), r-1, c];
    let p2 = [document.getElementById("r"+(r-1)+"c"+(c+1)), r-1, c+1];
    let p3 = [document.getElementById("r"+(r)+"c"+(c+1)), r, c+1];
    let p4 = [document.getElementById("r"+(r+1)+"c"+(c+1)), r+1, c+1];
    let p5 = [document.getElementById("r"+(r+1)+"c"+(c)), r+1, c];
    let p6 = [document.getElementById("r"+(r+1)+"c"+(c-1)), r+1, c-1];
    let p7 = [document.getElementById("r"+(r)+"c"+(c-1)), r, c-1];
    let p8 = [document.getElementById("r"+(r-1)+"c"+(c-1)), r-1, c-1];
    let plist = [p1, p2, p3, p4, p5, p6, p7, p8];
    let newplist = []
    for (let p of plist){
        if (p[1] > 0 && p[1] < 9 && p[2] > 0 && p[2] < 9){
            newplist.push(p);
        }
    }
    for (let p of newplist){
        if (p[0].getElementsByClassName("b").length > 0){
            p[0].getElementsByClassName("ring")[0].style.display = "inline-block";
        }
    }
}

function cbking(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let p1 = [document.getElementById("r"+(r-1)+"c"+(c)), r-1, c];
    let p2 = [document.getElementById("r"+(r-1)+"c"+(c+1)), r-1, c+1];
    let p3 = [document.getElementById("r"+(r)+"c"+(c+1)), r, c+1];
    let p4 = [document.getElementById("r"+(r+1)+"c"+(c+1)), r+1, c+1];
    let p5 = [document.getElementById("r"+(r+1)+"c"+(c)), r+1, c];
    let p6 = [document.getElementById("r"+(r+1)+"c"+(c-1)), r+1, c-1];
    let p7 = [document.getElementById("r"+(r)+"c"+(c-1)), r, c-1];
    let p8 = [document.getElementById("r"+(r-1)+"c"+(c-1)), r-1, c-1];
    let plist = [p1, p2, p3, p4, p5, p6, p7, p8];
    let newplist = []
    for (let p of plist){
        if (p[1] > 0 && p[1] < 9 && p[2] > 0 && p[2] < 9){
            newplist.push(p);
        }
    }
    for (let p of newplist){
        if (p[0].getElementsByClassName("w").length > 0){
            p[0].getElementsByClassName("ring")[0].style.display = "inline-block";
        }
    }
}

function cwpawn(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let e1 = [document.getElementById("r"+(r-1)+"c"+(c-1)), r-1, c-1];
    let e2 = [document.getElementById("r"+(r-1)+"c"+(c+1)), r-1, c+1];
    let elist = [e1, e2];
    let newelist = [];
    for (let e of elist){
        if (e[1] > 0 && e[2] > 0 && e[2] < 9){
            newelist.push(e);
        }
    }
    for (let e of newelist){
        if (e[0].getElementsByClassName("b").length > 0){
            e[0].getElementsByClassName("ring")[0].style.display = "inline-block";
        }
    }
}

function cbpawn(id){
    let r = Number(id[1]);
    let c = Number(id[3]);
    let e1 = [document.getElementById("r"+(r+1)+"c"+(c-1)), r+1, c-1];
    let e2 = [document.getElementById("r"+(r+1)+"c"+(c+1)), r+1, c+1];
    let elist = [e1, e2];
    let newelist = [];
    for (let e of elist){
        if (e[1] < 9 && e[2] > 0 && e[2] < 9){
            newelist.push(e);
        }
    }
    for (let e of newelist){
        if (e[0].getElementsByClassName("w").length > 0){
            e[0].getElementsByClassName("ring")[0].style.display = "inline-block";
        }
    }
}

function guid() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function gen(s){
    let img = document.createElement("img");
    img.id = guid();
    img.width = "72";
    img.height = "72";
    img.draggable = true;
    if (turn == 0){
        img.src = "images/w"+s+".png";
        img.className = "draggable w"+s+" w";
    }
    else{
        img.src = "images/b"+s+".png";
        img.className = "draggable b"+s+" b";
    }
    for (let i = 1; i < 9; i++){
        if (document.getElementById("r1c"+i).getElementsByClassName("wpawn").length > 0){
            document.getElementById("r1c"+i).getElementsByClassName("wpawn")[0].remove();
            document.getElementById("r1c"+i).appendChild(img);
        }
        if (document.getElementById("r8c"+i).getElementsByClassName("bpawn").length > 0){
            document.getElementById("r8c"+i).getElementsByClassName("bpawn")[0].remove();
            document.getElementById("r8c"+i).appendChild(img);
        }
    }
    let pieces = document.getElementsByClassName("draggable");
    for (let i = 0; i < pieces.length; i++){
        pieces[i].addEventListener("dragstart", dragstart);
    }
    img.addEventListener("dragend", dragend);
    document.getElementById("promo").style.display = "";
    endturnchecks();
}