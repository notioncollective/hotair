on run argv
    tell application "Adobe Photoshop"
        set js to "#include '../jsx/main.jsx';" & return
        set js to js & "main(arguments);" & return
        do javascript js with arguments argv
    end tell
end run