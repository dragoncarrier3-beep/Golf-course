class CategoryWeight {
  final String id;
  final String name;
  final double weight;

  const CategoryWeight({
    required this.id,
    required this.name,
    required this.weight,
  });

  factory CategoryWeight.fromJson(Map<String, dynamic> json) => CategoryWeight(
        id: json['id'] as String,
        name: json['name'] as String,
        weight: (json['weight'] as num).toDouble(),
      );

  Map<String, dynamic> toJson() => {'id': id, 'name': name, 'weight': weight};
}

const defaultScoreConfig = [
  CategoryWeight(id: 'greens_quality', name: 'Greens Quality', weight: 0.15),
  CategoryWeight(id: 'fairways', name: 'Fairways', weight: 0.13),
  CategoryWeight(id: 'value', name: 'Value', weight: 0.13),
  CategoryWeight(id: 'rough', name: 'Rough', weight: 0.11),
  CategoryWeight(id: 'practice_facility', name: 'Practice Facility', weight: 0.10),
  CategoryWeight(id: 'tee_boxes', name: 'Tee Boxes', weight: 0.09),
  CategoryWeight(id: 'fringes', name: 'Fringes', weight: 0.09),
  CategoryWeight(id: 'bunkers', name: 'Bunkers', weight: 0.08),
  CategoryWeight(id: 'staff_operations', name: 'Staff/Operations', weight: 0.08),
  CategoryWeight(id: 'layout_fun', name: 'Layout/Fun Factor', weight: 0.04),
];

double calculateWeightedScore(
  Map<String, int> categories,
  List<CategoryWeight> config,
) {
  var total = 0.0;
  for (final cat in config) {
    total += (categories[cat.id] ?? 0) * cat.weight;
  }
  return (total * 10).round() / 10;
}

String scoreToLetterGrade(double score) {
  if (score >= 9.5) return 'A+';
  if (score >= 9.0) return 'A';
  if (score >= 8.5) return 'A-';
  if (score >= 8.0) return 'B+';
  if (score >= 7.5) return 'B';
  if (score >= 7.0) return 'B-';
  if (score >= 6.5) return 'C+';
  if (score >= 6.0) return 'C';
  if (score >= 5.5) return 'C-';
  if (score >= 5.0) return 'D+';
  if (score >= 4.5) return 'D';
  return 'F';
}
