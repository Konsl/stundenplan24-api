/*
https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references

Array.from($0.children).map((e) => {
	return {
		labels: e.children[0].innerText.replaceAll(",[a]", "[a],").split(",").map(x => x.trim()).map(x => {
			return {
				name: x.replace("[a]", ""),
				canOmitSemicolon: x.includes("[a]")
			}
		}),
		content: e.children[2].innerText.split(",").map(x => String.fromCharCode(parseInt(x.trim().substring(2, 6), 16))).join("")
	}
})
*/