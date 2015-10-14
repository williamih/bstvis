function BSTNode(value) {
	this.value = value;
	this.left = null;
	this.right = null;
	this.locX = 0;
	this.locY = 0;
}

var root = null;

// ---------------------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------------------

function levelSeparation() {
	return 100;
}

function nodeRadius() {
	return 25;
}

// ---------------------------------------------------------------------------------------
// BST manipulation functions
// ---------------------------------------------------------------------------------------

function internalAddNode(node) {
	if (root == null) {
		root = node;
	} else {
		var parent = root;
		for (;;) {
			if (node.value < parent.value) {
				if (parent.left == null) {
					parent.left = node;
					return;
				} else {
					parent = parent.left;
				}
			} else if (node.value > parent.value) {
				if (parent.right == null) {
					parent.right = node;
					return;
				} else {
					parent = parent.right;
				}
			} else {
				return;
			}
		}
	}
}

function traverseInOrder(node, callback) {
	if (node.left != null) traverseInOrder(node.left, callback);
	callback(node);
	if (node.right != null) traverseInOrder(node.right, callback);
}

// ---------------------------------------------------------------------------------------
// BST rendering code
// ---------------------------------------------------------------------------------------

function widthOfSubtree(node) {
	if (node.left == null && node.right == null) {
		return 1;
	}
	var width = 0;
	if (node.left != null) width += widthOfSubtree(node.left);
	if (node.right != null) width += widthOfSubtree(node.right);
	return width;
}

function layoutSubtree(node, nodeY, left, right) {
	node.locX = (left + right) / 2;
	node.locY = nodeY;
	var parentWidth = widthOfSubtree(node);
	var x = left;
	if (node.left != null) {
		var fraction = widthOfSubtree(node.left) / parentWidth;
		var space = fraction * (right - left);
		layoutSubtree(node.left, nodeY + levelSeparation(), x, x + space);
		x += space;
	}
	if (node.right != null) {
		var fraction = widthOfSubtree(node.right) / parentWidth;
		var space = fraction * (right - left);
		layoutSubtree(node.right, nodeY + levelSeparation(), x, x + space);
		x += space;
	}
}

function drawLineBetweenNodes(context, parent, child) {
	context.beginPath();
	context.moveTo(parent.locX, parent.locY);
	context.lineTo(child.locX, child.locY);
	context.lineWidth = 1;
	context.strokeStyle = "#000000";
	context.stroke();
}

function displayBST(canvas, context) {
	if (root == null) return;

	layoutSubtree(root, 50, 50, canvas.width);

	context.clearRect(0, 0, canvas.width, canvas.height);
	traverseInOrder(root, function(node) {
		if (node.left != null) drawLineBetweenNodes(context, node, node.left);
		if (node.right != null) drawLineBetweenNodes(context, node, node.right);
	});
	traverseInOrder(root, function(node) {
		context.beginPath();
		context.arc(node.locX, node.locY, nodeRadius(), 0, 2 * Math.PI);
		context.fillStyle = "#FFFFFF";
		context.fill();
		context.lineWidth = 2;
		context.strokeStyle = "#000000";
		context.stroke();

		context.font = "10pt helvetica";
		context.fillStyle = "#000000";
		context.fillText(node.value, node.locX, node.locY);
	});
}

// ---------------------------------------------------------------------------------------
// UI code
// ---------------------------------------------------------------------------------------

function addNode() {
	var nodeValueInput = document.getElementById("nodeValueInput");

	var stringValue = nodeValueInput.value;
	var floatValue = parseFloat(stringValue);
	var finalValue = isNaN(floatValue) ? stringValue : floatValue;

	var node = new BSTNode(finalValue);

	nodeValueInput.value = "";

	internalAddNode(node);

	var canvas = document.getElementById("bstCanvas");
	var ctx = canvas.getContext("2d");
	displayBST(canvas, ctx);
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("addNodeButton").onclick = addNode;
	shortcut.add("enter", addNode);
});
