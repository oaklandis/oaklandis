$ ->
    $(document).foundation()
    $(document).ready ->
        $('.join-click').click (e) ->
            e.preventDefault()
            $('.join').slideDown()
