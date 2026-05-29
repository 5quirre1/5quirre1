for year_dir in assets/misc/photos-i-took/*; do
    [ -d "$year_dir" ] || continue

    year="$(basename "$year_dir")"

    [ "$year" = "thumbs" ] && continue

    thumb_dir="assets/misc/photos-i-took/thumbs/$year"
    mkdir -p "$thumb_dir"

    for f in "$year_dir"/*; do
        [ -f "$f" ] || continue

        base="$(basename "$f")"
        name="${base%.*}"
        thumb="$thumb_dir/${name}.webp"

        echo "generating $thumb"

        convert "$f" \
            -auto-orient \
            -thumbnail 320x240^ \
            -gravity center \
            -extent 320x240 \
            -quality 80 \
            "$thumb"
    done
done