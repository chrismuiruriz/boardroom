/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*
 * Displays or hides a Ratchet modal.
 *
 * USAGE:
 * $('#modelId').rmodal('show');
 */

$.fn.rmodal = function (display) {
    if (display === 'show') {
        $(this).show('slide', {direction: 'down'}, 1000).addClass('active');
    } else if (display === 'hide') {
        $(this).slideDown(function () {
            $(this).removeClass('active');
        });
    } else {
        console.error('This type is not defined for opening a modal.');
    }
};

$('a[data-type="rmodal"]').on('click', function (e) {
    e.preventDefault();

    var elId = $(this).attr('id'),
        $el = $('#' + elId);

    if ($el.is(':visible')) {
        $('#' + elId).slideDown(function () {
            $(this).removeClass('active');
        });
    } else {
        $('#' + elId).slideUp().addClass('active');
    }
});

