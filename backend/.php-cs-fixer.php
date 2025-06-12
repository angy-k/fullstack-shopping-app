<?php

/** @noinspection DuplicatedCode */

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$rules = [
    'array_indentation'      => true,
    'array_syntax'           => ['syntax' => 'short'],
    'binary_operator_spaces' => [
        'default'   => 'single_space',
        'operators' => [
            '='  => 'align_single_space_minimal',
            '=>' => 'align_single_space_minimal',
        ],
    ],
    'blank_line_after_namespace'   => true,
    'blank_line_after_opening_tag' => true,
    'blank_line_before_statement'  => [
        'statements' => ['return'],
    ],
    // 'statement_indentation'       => true,
    'cast_spaces'                 => true,
    'class_attributes_separation' => [
        'elements' => [
            'const'        => 'none',
            'method'       => 'one',
            'property'     => 'none',
            'trait_import' => 'none',
        ],
    ],
    'class_definition' => [
        'multi_line_extends_each_single_line' => true,
        'single_item_single_line'             => true,
        'single_line'                         => true,
    ],
    'concat_space' => [
        'spacing' => 'one',
    ],
    'constant_case'                => ['case' => 'lower'],
    'declare_equal_normalize'      => true,
    'elseif'                       => true,
    'encoding'                     => true,
    'full_opening_tag'             => true,
    'fully_qualified_strict_types' => true,
    'function_declaration'         => true,
    //    'type_declaration_spaces'      => [
    //        'elements' => ['function', 'property'],
    //    ],
    'heredoc_to_nowdoc'           => true,
    'include'                     => true,
    'increment_style'             => ['style' => 'post'],
    'indentation_type'            => true,
    'linebreak_after_opening_tag' => true,
    'line_ending'                 => true,
    'lowercase_cast'              => true,
    'lowercase_keywords'          => true,
    'lowercase_static_reference'  => true,
    'magic_method_casing'         => true,
    'magic_constant_casing'       => true,
    'method_argument_space'       => [
        'on_multiline' => 'ignore',
    ],
    'multiline_whitespace_before_semicolons' => [
        'strategy' => 'no_multi_line',
    ],
    'native_function_casing' => true,
    'no_alias_functions'     => true,
    'no_extra_blank_lines'   => [
        'tokens' => [
            'extra',
            'throw',
            'use',
        ],
    ],
    'no_blank_lines_after_class_opening' => true,
    'no_blank_lines_after_phpdoc'        => true,
    'no_closing_tag'                     => true,

    'no_empty_statement'              => true,
    'no_leading_import_slash'         => true,
    'no_leading_namespace_whitespace' => true,
    'no_mixed_echo_print'             => [
        'use' => 'echo',
    ],
    'no_multiline_whitespace_around_double_arrow' => true,
    'no_short_bool_cast'                          => true,
    'no_singleline_whitespace_before_semicolons'  => true,
    'no_spaces_after_function_name'               => true,
    'no_spaces_around_offset'                     => [
        'positions' => ['inside', 'outside'],
    ],
    //    'spaces_inside_parentheses'       => ['space' => 'none'],
    'no_spaces_inside_parenthesis' => true,
    //    'no_trailing_comma_in_singleline' => [
    //        'elements' => ['arguments', 'array', 'array_destructuring', 'group_import'],
    //    ],
    'no_trailing_comma_in_singleline_array' => true,
    'no_trailing_whitespace'                => true,
    'no_trailing_whitespace_in_comment'     => true,
    'no_unneeded_control_parentheses'       => true,
    'no_unreachable_default_argument_value' => true,
    'no_useless_return'                     => true,
    'no_whitespace_before_comma_in_array'   => true,
    'no_whitespace_in_blank_line'           => true,
    'normalize_index_brace'                 => true,
    'not_operator_with_successor_space'     => true,
    'object_operator_without_whitespace'    => true,
    'ordered_imports'                       => [
        'sort_algorithm' => 'length',
        'imports_order'  => ['const', 'class', 'function'],
    ],
    'psr_autoloading'            => true,
    'general_phpdoc_tag_rename'  => true,
    'no_empty_phpdoc'            => true,
    'no_superfluous_phpdoc_tags' => [
        'allow_mixed'         => false,
        'allow_unused_params' => false,
        'remove_inheritdoc'   => false,
    ],
    'phpdoc_align'                   => ['align' => 'vertical'],
    'phpdoc_indent'                  => true,
    'phpdoc_inline_tag_normalizer'   => true,
    'phpdoc_no_access'               => true,
    'phpdoc_no_package'              => true,
    'phpdoc_no_useless_inheritdoc'   => true,
    'phpdoc_scalar'                  => true,
    'phpdoc_single_line_var_spacing' => true,
    'phpdoc_summary'                 => false,
    'phpdoc_to_comment'              => false,
    'phpdoc_tag_type'                => true,
    'phpdoc_trim'                    => true,
    'phpdoc_types'                   => true,
    'phpdoc_var_without_name'        => true,
    'self_accessor'                  => true,
    'short_scalar_cast'              => true,
    'simplified_null_return'         => false, // disabled as "risky"
    'single_blank_line_at_eof'       => true,
    //    'blank_lines_before_namespace'   => [
    //        'min_line_breaks' => 1,
    //        'max_line_breaks' => 2,
    //    ],
    'single_class_element_per_statement' => true,
    'single_import_per_statement'        => true,
    'single_line_after_imports'          => true,
    'single_line_comment_style'          => [
        'comment_types' => ['hash'],
    ],
    'single_quote'                   => true,
    'space_after_semicolon'          => true,
    'standardize_not_equals'         => true,
    'switch_case_semicolon_to_colon' => true,
    'switch_case_space'              => true,
    'ternary_operator_spaces'        => true,
    'unary_operator_spaces'          => true,
    'trailing_comma_in_multiline'    => true,
    'trim_array_spaces'              => true,
    'visibility_required'            => [
        'elements' => ['method', 'property'],
    ],
    'whitespace_after_comma_in_array' => true,
    'no_unused_imports'               => true,
];

$finder = Finder::create()
    ->in([
        __DIR__ . '/app',
        __DIR__ . '/config',
        __DIR__ . '/database',
        __DIR__ . '/resources',
        __DIR__ . '/routes',
        __DIR__ . '/tests',
    ])
    ->name('*.php')
    ->notName('*.blade.php')
    ->ignoreDotFiles(true)
    ->ignoreVCS(true);

$config = new Config();

return $config->setFinder($finder)
    ->setRules($rules)
    ->setRiskyAllowed(true)
    ->setUsingCache(true);
