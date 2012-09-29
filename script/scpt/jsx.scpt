on run argv
    tell application "Adobe Photoshop CS5.1"
        set js to "#include '/Users/amdayton/Code/hotairnode/script/jsx/main.jsx';" & return
        set js to js & "main(arguments);" & return
        do javascript js with arguments argv
    end tell
end run