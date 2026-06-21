#!/bin/bash

MOVIE_DIR="./assets/misc/interests/movies"

case "$1" in
    clean)
        echo "cleaning up..,."
        rm "$MOVIE_DIR"/*.png
        echo "done"
        ;;
    *)
        for f in "$MOVIE_DIR"/*.png; do
            [ -f "$f" ] || continue
            
            base="$(basename "$f")"
            name="${base%.*}"
            
            echo "converting $base to webp..."
            convert "$f" -quality 85 "$MOVIE_DIR/${name}.webp"
        done
        ;;
esac